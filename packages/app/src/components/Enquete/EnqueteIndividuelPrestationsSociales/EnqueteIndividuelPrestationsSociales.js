import { useMutation, useQuery } from "@apollo/react-hooks";
import React, { useContext } from "react";

import { UserContext } from "../../UserContext";
import { ENQUETE_WITH_REPONSE_STATUS } from "../queries";
import { EnqueteIndividuelPrestationsSocialesForm } from "./EnqueteIndividuelPrestationsSocialesForm";
import { UPDATE_ENQUETE_INDIVIDUEL_PRESTATIONS_SOCIALES } from "./mutations";
import { ENQUETE_REPONSE_PRESTATIONS_SOCIALES } from "./queries";

export const EnqueteIndividuelPrestationsSociales = (props) => {
  const {
    enqueteContext,
    dispatchEnqueteContextEvent,
    enqueteReponse,
    enquete: { id: enqueteId },
    section,
    step,
  } = props;
  const {
    enquete_reponse_ids: { prestations_sociale_id },
  } = enqueteReponse;
  const { id: userId } = useContext(UserContext);
  const { data, loading } = useQuery(ENQUETE_REPONSE_PRESTATIONS_SOCIALES, {
    variables: {
      id: prestations_sociale_id,
    },
  });

  const [updateEnquete] = useMutation(
    UPDATE_ENQUETE_INDIVIDUEL_PRESTATIONS_SOCIALES,
    {
      refetchQueries: [
        {
          query: ENQUETE_WITH_REPONSE_STATUS,
          variables: { enqueteId, userId },
        },
        {
          query: ENQUETE_REPONSE_PRESTATIONS_SOCIALES,
          variables: { id: prestations_sociale_id },
        },
      ],
    }
  );

  const prestationsSociales = data
    ? data.enquete_reponses_prestations_sociales_by_pk || {}
    : {};
  return (
    <EnqueteIndividuelPrestationsSocialesForm
      loading={loading}
      data={prestationsSociales}
      section={section}
      step={step}
      enqueteContext={enqueteContext}
      dispatchEnqueteContextEvent={dispatchEnqueteContextEvent}
      onSubmit={async (values) => {
        await updateEnquete({
          variables: {
            id: prestations_sociale_id,
            ...values,
          },
        });
      }}
    />
  );
};

export default EnqueteIndividuelPrestationsSociales;
