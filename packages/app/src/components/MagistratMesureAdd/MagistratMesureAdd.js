import { useMutation } from "@apollo/react-hooks";
import Router from "next/router";
import React, { useContext } from "react";
import { Box } from "rebass";

import { formatGestionnaireId } from "../../util/mandataires";
import { GESTIONNAIRES } from "../MagistratMesureMandataire/queries";
import { MagistratMesureMandataireTitle } from "../MagistratMesureMandataireTitle";
import { MAGISTRAT_MESURES_QUERY } from "../MagistratMesures/queries";
import { MagistratMesureServiceTitle } from "../MagistratMesureServiceTitle";
import { UserContext } from "../UserContext";
import { MagistratMesureAddForm } from "./MagistratMesureAddForm";
import {
  CALCULATE_MESURES,
  CHOOSE_MANDATAIRE,
  SEND_EMAIL_RESERVATION,
} from "./mutations";
import { MagistratMandataireStyle } from "./style";

const MagistratMesureAdd = (props) => {
  const { gestionnaireId } = props;

  const {
    cabinet,
    magistrat: { ti_id: tiId, id: magistratId },
  } = useContext(UserContext);

  const { mandataireId, serviceId } = formatGestionnaireId(gestionnaireId);

  const [sendEmailReservation] = useMutation(SEND_EMAIL_RESERVATION);

  const [recalculateMesures] = useMutation(CALCULATE_MESURES);

  const [chooseMandataire] = useMutation(CHOOSE_MANDATAIRE, {
    onCompleted: async ({ insert_mesures }) => {
      const [mesure] = insert_mesures.returning;

      await recalculateMesures({
        awaitRefetchQueries: true,
        refetchQueries: [
          {
            query: GESTIONNAIRES,
            variables: {
              mandataire_id: mandataireId,
              service_id: serviceId,
            },
          },
          {
            query: MAGISTRAT_MESURES_QUERY,
            variables: {
              natureMesure: null,
              offset: 0,
              searchText: null,
              tiId: tiId,
            },
          },
        ],
        variables: {
          mandataireId,
          serviceId,
        },
      });

      await sendEmailReservation({
        variables: {
          mesure_id: mesure.id,
        },
      });

      await Router.push(
        "/magistrats/mesures/[mesure_id]",
        `/magistrats/mesures/${mesure.id}`,
        {
          shallow: true,
        }
      );
    },
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    await chooseMandataire({
      variables: {
        annee_naissance: values.annee_naissance,
        cabinet: values.cabinet,
        champ_mesure: values.champ_mesure ? values.champ_mesure : null,
        civilite: values.civilite,
        judgmentDate: values.judgmentDate === "" ? null : values.judgmentDate,
        magistrat_id: magistratId,
        mandataire_id: mandataireId,
        nature_mesure: values.nature_mesure,
        numero_rg: values.numero_rg,
        service_id: serviceId,
        ti: tiId,
        urgent: values.urgent,
      },
    });

    setSubmitting(false);
  };

  const cancelActionRoute = gestionnaireId
    ? {
        as: `/magistrats/gestionnaires/${gestionnaireId}`,
        href: "/magistrats/gestionnaires/[gestionnaire_id]",
      }
    : {
        as: `/magistrats`,
        href: `/magistrats`,
      };

  return (
    <Box>
      {serviceId && <MagistratMesureServiceTitle id={serviceId} />}
      {mandataireId && <MagistratMesureMandataireTitle id={mandataireId} />}
      <Box sx={MagistratMandataireStyle} {...props}>
        <MagistratMesureAddForm
          handleSubmit={handleSubmit}
          cancelActionRoute={cancelActionRoute}
          cabinet={cabinet}
        />
      </Box>
    </Box>
  );
};

export { MagistratMesureAdd };
