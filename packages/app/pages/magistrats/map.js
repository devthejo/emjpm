import React, { useContext } from "react";
import { Box, Flex } from "rebass";

import { LayoutMagistratMap } from "../../src/components/Layout";
import { MagistratMandatairesMap } from "../../src/components/MagistratMandatairesMap";
import { MagistratMapMandatairesPanelList } from "../../src/components/MagistratMapMandatairesPanelList";
import { MapContextProvider } from "../../src/components/Map/context";
import { UserContext } from "../../src/components/UserContext";
import { withAuthSync } from "../../src/util/auth";

const Map = () => {
  const { magistrat } = useContext(UserContext);
  const {
    ti: { latitude, longitude },
  } = magistrat;
  return (
    <MapContextProvider latitude={latitude} longitude={longitude}>
      <LayoutMagistratMap>
        <Flex
          sx={{
            height: "100%",
            position: "absolute",
            pt: "115px",
            top: "0",
            width: "100%",
          }}
        >
          <Box height="100%" flex="0 1 auto" width="600px">
            <MagistratMapMandatairesPanelList />
          </Box>
          <Box height="100%" flex="1 1 auto">
            <MagistratMandatairesMap />
          </Box>
        </Flex>
      </LayoutMagistratMap>
    </MapContextProvider>
  );
};

export default withAuthSync(Map);
