import React from "react";
import { useMutation, useQuery } from "react-apollo";

import { parseFloatValue } from "../../../util";
import { ENQUETE_REPONSE_STATUS } from "../queries";
import { EnquetePreposePrestationsSocialesRepartitionPersonnesForm } from "./EnquetePreposePrestationsSocialesRepartitionPersonnesForm";
import { UPDATE_ENQUETE_PREPOSE_PRESTATIONS_SOCIALES_REPARTITION } from "./mutations";
import { ENQUETE_PREPOSE_PRESTATIONS_SOCIALES } from "./queries";

export const EnquetePreposePrestationsSocialesRepartitionPersonnes = (props) => {
  const {
    enqueteContext,
    dispatchEnqueteContextEvent,
    enqueteReponse,
    step,
    userId,
    enquete: { id: enqueteId },
  } = props;
  const {
    enquete_reponse_ids: { prestations_sociales_id },
  } = enqueteReponse;

  const { data, loading } = useQuery(ENQUETE_PREPOSE_PRESTATIONS_SOCIALES, {
    variables: {
      id: prestations_sociales_id,
    },
  });

  const [updateEnquete] = useMutation(UPDATE_ENQUETE_PREPOSE_PRESTATIONS_SOCIALES_REPARTITION, {
    refetchQueries: [
      {
        query: ENQUETE_REPONSE_STATUS,
        variables: { enqueteId, userId },
      },
      {
        query: ENQUETE_PREPOSE_PRESTATIONS_SOCIALES,
        variables: {
          id: prestations_sociales_id,
        },
      },
    ],
  });

  const prestationsSociales = data
    ? data.enquete_reponses_prepose_prestations_sociales_by_pk || {}
    : {};

  return (
    <EnquetePreposePrestationsSocialesRepartitionPersonnesForm
      data={prestationsSociales}
      step={step}
      enqueteContext={enqueteContext}
      dispatchEnqueteContextEvent={dispatchEnqueteContextEvent}
      loading={loading}
      onSubmit={async (values) => {
        await updateEnquete({
          variables: {
            id: prestations_sociales_id,
            aah: parseFloatValue(values.aah),
            pch: parseFloatValue(values.pch),
            asi: parseFloatValue(values.asi),
            rsa: parseFloatValue(values.rsa),
            als_apl: parseFloatValue(values.als_apl),
            aspa: parseFloatValue(values.aspa),
            apa: parseFloatValue(values.apa),
          },
        });
      }}
    />
  );
};

export default EnquetePreposePrestationsSocialesRepartitionPersonnes;