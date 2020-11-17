const express = require("express");
const XLSX = require("xlsx");

const actionsMesuresImporter = require("./mesures-import/actionsMesuresImporter");
const checkImportMesuresParameters = require("./hasura-actions.mesures-import.checker");
const hasuraActionErrorHandler = require("../../../middlewares/hasura-error-handler");
const getMesures = require("../../../services/getMesures");
const { Mesure } = require("../../../models/Mesure");
const { OcmiMandataire } = require("../../../models/OcmiMandataire");
const { LbUser } = require("../../../models/LbUser");
const { isEnAttente, MESURE_PROTECTION_STATUS } = require("@emjpm/core");
const { getEmailUserDatas } = require("../../../email/email-user-data");
const {
  cancelReservationEmail,
} = require("../../../email/cancel-reservation-email");
const { Mandataire } = require("../../../models/Mandataire");
const { Tis } = require("../../../models/Tis");
const mesureStatesService = require("../../../services/updateMesureStates");
const {
  saveMesures,
} = require("../../../controllers/editor/service/saveMesure");
const fetchTribunaux = require("../../../controllers/editor/service/fetchTribunaux");
const { MesureRessources } = require("../../../models/MesureRessources");
const { MesureEtat } = require("../../../models/MesureEtat");

const router = express.Router();

// hasura action: `upload_mesures_file`
router.post(
  "/upload",
  async (req, res, next) => {
    try {
      const importMesuresParameters = await checkImportMesuresParameters(req);

      const importSummary = await actionsMesuresImporter.importMesuresFile(
        importMesuresParameters
      );

      return res.status(201).json({
        data: JSON.stringify(importSummary),
      });
    } catch (err) {
      return next(err);
    }
  },
  hasuraActionErrorHandler("Unexpected error processing file")
);

// hasura action: `export_mesures_file`
router.post(
  "/export",
  async (req, res, next) => {
    try {
      const { userId, serviceId } = req.user;
      const mesures = await getMesures({ serviceId, userId });
      const exportedMesures = mesures.map((mesure) => {
        const {
          numero_rg,
          numero_dossier,
          date_nomination,
          code_postal,
          ville,
          pays,
          civilite,
          annee_naissance,
          lieu_vie,
          nature_mesure,
          champ_mesure,
          tis,
          cabinet,
        } = mesure;
        return {
          annee_naissance,
          cabinet,
          champ_mesure,
          civilite,
          code_postal,
          date_nomination,
          lieu_vie,
          nature_mesure,
          numero_dossier,
          numero_rg,
          pays,
          tribunal: tis ? tis.etablissement : "",
          ville,
        };
      });
      if (mesures.length) {
        var ws = XLSX.utils.json_to_sheet(exportedMesures, {
          header: Object.keys(exportedMesures[0]),
        });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Mesures eMJPM");
        res.header("Content-Type", "application/octet-stream");
        res.attachment("export_mesures.xlsx");

        var wopts = { bookSST: false, bookType: "xlsx", type: "base64" };
        var wbout = XLSX.write(wb, wopts);

        return res.send({ data: wbout });
      } else {
        return res.status(404).end();
      }
    } catch (err) {
      return next(err);
    }
  },
  hasuraActionErrorHandler("Unexpected error processing file")
);

// hasura action: `delete_mesure`
router.post("/delete", async function (req, res) {
  const { mesure_id } = req.body.input;

  try {
    const mesure = await Mesure.query().findById(mesure_id);
    const { ti_id, service_id, mandataire_id, status } = mesure;

    if (!isEnAttente({ status }))
      throw new Error(
        `Delete needs a mesure with en_attente status (The mesure_id ${mesure.id} has ${status} status)`
      );

    const nbDeleted = await Mesure.query().deleteById(mesure_id);

    if (nbDeleted === 0) return res.json({ success: false });

    const ti = await Tis.query().findById(ti_id);
    const users = await getEmailUserDatas(mandataire_id, service_id);
    const emails = users.map((user) =>
      cancelReservationEmail(ti, mesure, user)
    );

    Promise.all(emails);
  } catch (error) {
    console.error(error);
    hasuraActionErrorHandler("Unexpected error with delete mesure");

    return res.json({ success: false });
  }

  res.json({ success: true });
});

router.post("/import-ocmi-mesures", async (req, res) => {
  const { userId } = req.user;

  const mandataire = await Mandataire.query().findOne({ user_id: userId });

  const { id: mandataireId, lb_user_id: lbUserId } = mandataire;

  await deleteAllMesures(mandataireId);

  const { siret } = await LbUser.query().findById(lbUserId);

  const { mesures } = await OcmiMandataire.query().findOne({
    siret,
  });

  // check tribunal_siret validity and load tis
  const { errors: tiErrors, tribunaux } = await fetchTribunaux(mesures);
  if (tiErrors.length > 0) {
    return res.status(422).json({ tiErrors });
  }

  const allMesureDatas = mesures.map((mesure) => ({
    datas: {
      ...mesure,
      etats: mesure.etats.map((etat) => ({
        ...etat,
        date_changement_etat: new Date(etat.date_changement_etat),
      })),
    },
    serviceOrMandataire: mandataire,
    ti: findTribunal(tribunaux, mesure.tribunal_siret),
    type: "mandataire",
  }));

  await saveMesures(allMesureDatas);

  await mesureStatesService.updateMandataireMesureStates(mandataireId);

  /*
  // In case of errors:
  return res.status(400).json({
    message: "error happened"
  })
  */

  // success
  return res.json({
    en_cours: "0",
    eteinte: "0",
  });
});

module.exports = router;

function findTribunal(tribunaux, tribunalSiret) {
  return tribunaux.find((t) => t.siret === tribunalSiret);
}

async function deleteAllMesures(mandataireId) {
  const mesureIdsQuery = Mesure.query()
    .select("id")
    .where({ mandataire_id: mandataireId })
    .andWhere("status", "in", [
      MESURE_PROTECTION_STATUS.en_cours,
      MESURE_PROTECTION_STATUS.eteinte,
    ]);

  await MesureEtat.query().delete().whereIn("mesure_id", mesureIdsQuery);

  await MesureRessources.query().delete().whereIn("mesure_id", mesureIdsQuery);

  await Mesure.query()
    .delete()
    .where({ mandataire_id: mandataireId })
    .andWhere("status", "in", [
      MESURE_PROTECTION_STATUS.en_cours,
      MESURE_PROTECTION_STATUS.eteinte,
    ]);
}
