import { useQuery } from "@apollo/react-hooks";
import { Card, Heading2, Heading4, Spinner } from "@emjpm/ui";
import React, { useContext } from "react";
import { Box } from "rebass";

import { convertToPercentage } from "../../util/math";
import { FiltersContextSerializable } from "../FiltersContextSerializable";
import { MandatairesActivityChart } from "./MandatairesActivityChart";
import { MANDATAIRE_ACTIVITY } from "./queries";

const MandatairesActivity = (props) => {
  const { filters } = useContext(FiltersContextSerializable);
  const { data, error, loading } = useQuery(MANDATAIRE_ACTIVITY, {
    variables: {
      department: filters.departement
        ? parseInt(filters.departement)
        : undefined,
      region: filters.region ? parseInt(filters.region) : undefined,
    },
  });

  if (loading) {
    return (
      <Card p="4">
        <Heading2>Répartition de l’activité par type de mandataires</Heading2>
        <Box my="5">
          <Spinner />
        </Box>
      </Card>
    );
  }

  if (error) {
    return (
      <Card p="4">
        <Heading2>Répartition de l’activité par type de mandataires</Heading2>
        <Heading4>erreur</Heading4>
      </Card>
    );
  }

  const service = data.service.aggregate.sum.mesures_in_progress;
  const mandataireIndividuel =
    data.mandataireIndividuel.aggregate.sum.mesures_in_progress;
  const mandatairePrepose =
    data.mandatairePrepose.aggregate.sum.mesures_in_progress;
  const total = service + mandataireIndividuel + mandatairePrepose;

  const activityChartData = {
    mandataireIndividuel: {
      percentage: convertToPercentage(mandataireIndividuel, total),
      sum: mandataireIndividuel,
    },
    mandatairePrepose: {
      percentage: convertToPercentage(mandatairePrepose, total),
      sum: mandatairePrepose,
    },
    service: {
      percentage: convertToPercentage(service, total),
      sum: service,
    },
    total,
  };

  return (
    <Card p="4" {...props}>
      <Heading2>Répartition de l’activité par type de mandataires</Heading2>
      <MandatairesActivityChart data={activityChartData} />
    </Card>
  );
};

export { MandatairesActivity };
