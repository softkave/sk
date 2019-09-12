import styled from "@emotion/styled";
import React from "react";

import WebBody from "./WebBody";
import WebFooter from "./WebFooter";
import WebHeader from "./WebHeader";

const Web: React.SFC<{}> = () => {
  return (
    <StyledWeb>
      <StyledWebHeader>
        <WebHeader />
      </StyledWebHeader>
      <StyledWebBody>
        <WebBody />
      </StyledWebBody>
      <StyledWebFooter>
        <WebFooter />
      </StyledWebFooter>
    </StyledWeb>
  );
};

export default Web;

const StyledWeb = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

const StyledWebHeader = styled.div``;

const StyledWebBody = styled.div`
  flex: 1;
  display: flex;
  margin: 32px 0;
`;

const StyledWebFooter = styled.div``;
