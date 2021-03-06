const {
  getValidationStatus,
  getGlobalStatus,
} = require("../enqueteSchemaUtil");
const yup = require("yup");
const { ENQ_REP_MODALITE_EXERCICE } = require("../../constants");

const debugGroupName = "modalitesExercice";

module.exports = async (enqueteReponse) => {
  // IMPORTANT: construire les status dans l'ordre d'affichage car un statut "empty" devient "invalid" si au moins un onglet précédent a été renseigné
  const informationsGenerales = await getValidationStatus(
    enqueteReponse.enquete_reponses_modalites_exercice,
    {
      debugName: `${debugGroupName}/informationsGenerales`,
      logDataWithErrors: false,
      schema: yup.object().shape({
        activite_exercee_par: yup
          .mixed()
          .oneOf(ENQ_REP_MODALITE_EXERCICE.ACTIVE_EXERCEE_PAR.keys)
          .required(),
        departement: yup.string().required(),
        etablissements_type: yup
          .mixed()
          .oneOf(ENQ_REP_MODALITE_EXERCICE.ETABLISSEMENTS_TYPE.keys)
          .required(),
        personnalite_juridique_etablissement: yup.string().required(),
        raison_sociale: yup.string().required(),
        region: yup.string().required(),
        total_mesures_etablissements: yup.number().min(0).required(),
      }),
    }
  );
  const etablissements = await getValidationStatus(
    enqueteReponse.enquete_reponses_modalites_exercice,
    {
      debugName: `${debugGroupName}/etablissements`,
      logDataWithErrors: false,
      schema: yup.object().shape({
        nombre_lits_journee_hospitalisation: yup.array().of(
          yup.object().shape({
            finess: yup.string().required(),
            nombre_journees_esms: yup.number().min(0).required(),
            nombre_journees_hospitalisation: yup.number().min(0).required(),
            nombre_lits: yup.number().min(0).required(),
            nombre_mesures: yup.number().min(0).required(),
            raison_sociale: yup.string().required(),
            statut: yup.string().required(),
            type: yup.string().required(),
          })
        ),
      }),
    }
  );
  const status = {
    etablissements: etablissements,
    informationsGenerales: informationsGenerales,
  };

  status.global = getGlobalStatus(status);

  return status;
};
