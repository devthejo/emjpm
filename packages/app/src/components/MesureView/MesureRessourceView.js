import React from "react";
import { Box, Flex, Text } from "rebass";

import { content, subtitle } from "./style";

const MesureRessourceView = ({ ressource, ...props }) => {
  return (
    <Flex {...props} justifyContent="flex-start">
      <Box width="100px">
        <Text sx={subtitle}>{`Année`}</Text>
        <Text sx={content}>{ressource.annee}</Text>
      </Box>
      <Box width="150px">
        <Text sx={subtitle}>Ressource</Text>
        <Text sx={content}>{ressource.niveauRessource} €</Text>
      </Box>

      <Box>
        <Text sx={subtitle}>Prestations soc.</Text>
        <Text sx={content}>{ressource.prestationsSociales}</Text>
      </Box>
    </Flex>
  );
};

export { MesureRessourceView };
