import { Card, Heading3 } from "@emjpm/ui";
import React from "react";
import { Flex, Text } from "rebass";

import { importErrorsWrapperStyle } from "./style";

const EnqueteImportErrors = (props) => {
  const { errors } = props;

  return (
    <Card sx={importErrorsWrapperStyle} overflow="hidden">
      <Heading3 mb={4}>Détail des erreurs par ligne</Heading3>
      {errors.map(({ line = 0, message }) => (
        <Flex key={`${line}-${message}`} mb={1}>
          <Text color="warning" mr={1}>
            LIGNE {line}
          </Text>
          <Text>{message}</Text>
        </Flex>
      ))}
    </Card>
  );
};

export { EnqueteImportErrors };
