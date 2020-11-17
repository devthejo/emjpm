import React, { useContext } from "react";
import { Box, Flex } from "rebass";

import { getUserBasePath } from "../../constants";
import { LinkButton } from "../Commons";
import { MesureExportExcelButton } from "../MesureExportExcelButton";
import { MesureImportOcmiButton } from "../MesureImportOcmiButton";
import { UserContext } from "../UserContext";

const MesureListButtonBar = () => {
  const {
    type,
    mandataire: { lb_user = {} },
  } = useContext(UserContext);
  const { ocmi_mandataire } = lb_user;

  const path = getUserBasePath({ type });

  return (
    <Box>
      <Flex flexDirection="row">
        <Box>
          <LinkButton href={`${path}/add-mesures`}>
            Ajouter une mesure
          </LinkButton>
        </Box>
        <Box ml={1}>
          <LinkButton href={`${path}/import-mesures`}>
            Importez vos mesures
          </LinkButton>
        </Box>
        {ocmi_mandataire && <MesureImportOcmiButton ml={1} />}
        <MesureExportExcelButton ml={1} mr={2} />
      </Flex>
    </Box>
  );
};

export { MesureListButtonBar };
