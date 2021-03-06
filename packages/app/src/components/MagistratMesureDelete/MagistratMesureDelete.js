import React, { useContext } from "react";
import { Flex } from "rebass";

import { MesureContext } from "../MesureContext";
import { MagistratMesureDeleteForm } from "./MagistratMesureDeleteForm";
import { MagistratMesureRemoveStyle } from "./style";

export const MagistratMesureDelete = () => {
  const mesure = useContext(MesureContext);

  return (
    <Flex sx={MagistratMesureRemoveStyle}>
      <MagistratMesureDeleteForm mesure={mesure} />
    </Flex>
  );
};
