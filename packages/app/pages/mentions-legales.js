import { FlexWrapper } from "@emjpm/ui";
import { MDXProvider } from "@mdx-js/react";
import React from "react";
import { Card } from "rebass";

import { LayoutPublic } from "../src/components/Layout";
import { mdxComponents } from "../src/components/MdxComponents";
import { MentionsLegales } from "../src/components/MentionsLegales";

const MentionsLegalesPage = () => (
  <MDXProvider components={mdxComponents}>
    <LayoutPublic>
      <FlexWrapper p="4" my="50px">
        <Card p={3}>
          <MentionsLegales />
        </Card>
      </FlexWrapper>
    </LayoutPublic>
  </MDXProvider>
);

export default MentionsLegalesPage;
