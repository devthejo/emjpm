import { useQuery } from "@apollo/react-hooks";
import { Antenne, Card, Heading3, Heading4, Spinner } from "@emjpm/ui";
import PropTypes from "prop-types";
import React from "react";
import { Box, Flex } from "rebass";

import { SERVICE_ANTENNES } from "./queries";

const MagistratServiceAntennes = (props) => {
  const { serviceId } = props;
  const { data, error, loading } = useQuery(SERVICE_ANTENNES, {
    variables: {
      serviceId: serviceId,
    },
  });

  if (loading) {
    return (
      <Card width="100%">
        <Box my="5">
          <Spinner />
        </Box>
      </Card>
    );
  }

  if (error) {
    return (
      <Card width="100%">
        <Heading4>erreur</Heading4>
      </Card>
    );
  }

  const { service_antenne } = data;

  if (service_antenne.length < 1) {
    return null;
  }

  return (
    <Box>
      <Heading3 mt="4" mb="3">
        Liste des antennes du service
      </Heading3>
      <Flex flexWrap="wrap" justifyContent="space-around">
        {service_antenne.map((antenne) => {
          antenne = { ...antenne, preferences: [] };
          return (
            <Antenne
              sx={{ m: "1", minHeight: "200px", p: "3", width: "250px" }}
              key={antenne.id}
              antenne={antenne}
              hasButton={false}
            />
          );
        })}
      </Flex>
    </Box>
  );
};

MagistratServiceAntennes.propTypes = {
  serviceId: PropTypes.number,
};

export { MagistratServiceAntennes };
