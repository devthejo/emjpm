import {
  BoxWrapper,
  FlexWrapper,
  fourColumnStyle,
  twoColumnStyle
} from "@socialgouv/emjpm-ui-core";
import React from "react";
import { Box } from "rebass";
import { AvailabilityMap } from "../../src/components-v2/AvailabilityMap";
import { Filters } from "../../src/components-v2/Filters";
import { FiltersContextProvider } from "../../src/components-v2/Filters/context";
import {
  AvailableMesureIndicator,
  EtablissementIndicator,
  MandatairesIndicator,
  ServicesIndicator
} from "../../src/components-v2/Indicators";
import { LayoutDirection } from "../../src/components-v2/Layout";
import { MandatairesActivity } from "../../src/components-v2/MandatairesActivity";
import { MandatairesDisponibility } from "../../src/components-v2/MandatairesDisponibility";

const Mandataires = () => {
  return (
    <FiltersContextProvider>
      <LayoutDirection>
        <BoxWrapper mt={5} px="1">
          <Filters />
        </BoxWrapper>
        <FlexWrapper flexWrap={"wrap"} mt={5}>
          <Box sx={fourColumnStyle}>
            <ServicesIndicator />
          </Box>
          <Box sx={fourColumnStyle}>
            <MandatairesIndicator />
          </Box>
          <Box sx={fourColumnStyle}>
            <EtablissementIndicator />
          </Box>
          <Box sx={fourColumnStyle}>
            <AvailableMesureIndicator />
          </Box>
        </FlexWrapper>
        <FlexWrapper flexWrap={"wrap"} mt={5}>
          <Box sx={twoColumnStyle}>
            <AvailabilityMap />
          </Box>
          <Box sx={twoColumnStyle}>
            <MandatairesDisponibility />
          </Box>
        </FlexWrapper>
        <FlexWrapper flexWrap={"wrap"} mt={5}>
          <Box sx={twoColumnStyle}>
            <MandatairesActivity />
          </Box>
        </FlexWrapper>
      </LayoutDirection>
    </FiltersContextProvider>
  );
};

export default Mandataires;