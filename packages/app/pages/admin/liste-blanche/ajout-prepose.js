import { BoxWrapper, Heading1 } from "@emjpm/ui";
import Link from "next/link";
import React from "react";
import { Link as StyledLink } from "rebass";

import { LayoutAdmin } from "../../../src/components/Layout";
import { ListeBlanchePreposeCreate } from "../../../src/components/ListeBlanche";
import { withAuthSync } from "../../../src/util/auth";

const ListBlanchePage = () => {
  return (
    <LayoutAdmin>
      <BoxWrapper mt={4} px={1}>
        <Link href="/admin/liste-blanche">
          <StyledLink mb={4} display="block">
            &larr; Retour
          </StyledLink>
        </Link>
        <Heading1 mb={4}>
          {"Ajout d'un mandataire préposé à la liste blanche"}
        </Heading1>
        <ListeBlanchePreposeCreate />
      </BoxWrapper>
    </LayoutAdmin>
  );
};

export default withAuthSync(ListBlanchePage);
