import { useMutation } from "@apollo/react-hooks";
import { MESURE_PROTECTION_STATUS } from "@emjpm/core";
import Router from "next/router";
import React, { useContext } from "react";
import { Box } from "rebass";

import { getUserBasePath } from "../../constants";
import { MesureContext } from "../MesureContext";
import { MESURE_CONTEXT_QUERY } from "../MesureContext/queries";
import { MESURES_QUERY } from "../MesureList/queries";
import { UserContext } from "../UserContext";
import { MesureReactivateForm } from "./MesureReactivateForm";
import { CALCULATE_MESURES, REACTIVATE_MESURE } from "./mutations";
import { MesureReactivateStyle } from "./style";

const MesureReactivate = () => {
  const mesure = useContext(MesureContext);
  const { type, service = {}, mandataire } = useContext(UserContext);
  const userBasePath = getUserBasePath({ type });

  const [recalculateMesures] = useMutation(CALCULATE_MESURES);

  const redirectToMesure = (mesureId) =>
    Router.push(
      `${userBasePath}/mesures/[mesure_id]`,
      `${userBasePath}/mesures/${mesureId}`,
      {
        shallow: true,
      }
    );

  const [updateMesure] = useMutation(REACTIVATE_MESURE, {
    onCompleted: async () => {
      await recalculateMesures({
        refetchQueries: ["CURRENT_USER_QUERY"],
        variables: {
          mandataireId: mandataire ? mandataire.id : null,
          serviceId: service ? service.id : null,
        },
      });
      redirectToMesure(mesure.id);
    },
  });

  const handleSubmit = async () => {
    await updateMesure({
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: MESURE_CONTEXT_QUERY,
          variables: {
            id: mesure.id,
          },
        },
        {
          query: MESURES_QUERY,
          variables: {
            antenne: null,
            limit: 20,
            natureMesure: null,
            offset: 0,
            searchText: null,
            status: MESURE_PROTECTION_STATUS.en_cours,
          },
        },
        {
          query: MESURES_QUERY,
          variables: {
            antenne: null,
            limit: 20,
            natureMesure: null,
            offset: 0,
            searchText: null,
            status: MESURE_PROTECTION_STATUS.eteinte,
          },
        },
      ],
      variables: {
        id: mesure.id,
      },
    });
  };

  const handleCancel = () => {
    redirectToMesure(mesure.id);
  };

  return (
    <Box sx={MesureReactivateStyle}>
      <MesureReactivateForm
        mt="3"
        mesure={mesure}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
    </Box>
  );
};

export { MesureReactivate };
