import { isIndividuel, isPrepose, isService } from "@emjpm/core";
import { Heading1 } from "@emjpm/ui";
import { format } from "date-fns";
import React, { useContext } from "react";
import { Box, Button, Flex, Text } from "rebass";

import { UserContext } from "../../../../src/components/UserContext";
import { LinkButton } from "../../../components/Commons";
import { EnqueteAlreadySubmitted } from "./EnqueteAlreadySubmitted";

const textStyle = {
  lineHeight: "30px",
  textAlign: "center",
};

const downloadStyle = { color: "blue", textDecoration: "underline" };

const getExcelName = (type) => {
  if (isService({ type })) {
    return "annexe_3-2019.xls";
  }
  if (isIndividuel({ type })) {
    return "annexe_5-2019.xls";
  }
  if (isPrepose({ type })) {
    return "annexe_7-2019.xls";
  }
};

export const EnqueteWelcome = ({
  goToFirstPage,
  enquete,
  enqueteReponse,
  pathPrefix,
}) => {
  const { id: enqueteId } = enquete;

  const { type } = useContext(UserContext);

  return enqueteReponse.status !== "draft" ? (
    <EnqueteAlreadySubmitted enquete={enquete} goToFirstPage={goToFirstPage} />
  ) : (
    <Flex flexDirection="column">
      <Flex flexDirection="column" mb="5">
        <Heading1 textAlign="center">Bienvenue</Heading1>
        <Flex flexDirection="column" mt="4" mb="3" sx={textStyle}>
          <Text>Vous pouvez revenir à tout moment compléter le formulaire</Text>
          <Text sx={{ fontWeight: "700" }}>
            jusqu’au {format(new Date(enquete.date_fin), "dd/MM/yyyy")}.
          </Text>
          <Text>
            Vous pouvez appuyer sur la touche tab pour passer d’un champ à un
            autre.
          </Text>
        </Flex>
        <Button onClick={() => goToFirstPage()} mx="auto">
          Répondre
        </Button>
      </Flex>
      <Flex flexDirection="column">
        <Box mt="4" sx={textStyle}>
          <Text as="span">{`Vous avez déjà rempli le `}</Text>
          <Text as="span" sx={downloadStyle}>
            <a
              href={`/static/docs/enquetes/${getExcelName(type)}`}
            >{`fichier excel`}</a>
          </Text>

          <Text as="span">{` envoyé par votre direction départementale?`}</Text>
        </Box>

        <LinkButton
          mx="auto"
          pt={15}
          mt={4}
          href={`${pathPrefix}/[enquete_id]/import`}
          asLink={`${pathPrefix}/${enqueteId}/import`}
          outline
        >
          Importez votre enquête
        </LinkButton>
      </Flex>
      <Flex flexDirection="column">
        <Box mt="4" sx={textStyle}>
          <Text as="span">{`Pour plus de détails, vous pouvez télécharger le `}</Text>
          <Text as="span" sx={downloadStyle}>
            <a
              href={`/static/docs/enquetes/DGCS_Mandoline_guide-de-remplissage-des-enquetes.pdf`}
            >{`guide de remplissage des enquêtes.`}</a>
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};
