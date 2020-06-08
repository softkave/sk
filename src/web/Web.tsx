import styled from "@emotion/styled";
import React from "react";
import WebBody from "./WebBody";
import WebFooter from "./WebFooter";
import WebHeader from "./WebHeader";

const Web: React.SFC<{}> = () => {
  return (
    <StyledWeb>
      <WebHeader />
      <StyledWebBody>
        <WebBody />
      </StyledWebBody>
      <WebFooter />
    </StyledWeb>
  );
};

export default Web;

const StyledWeb = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

const StyledWebBody = styled.div`
  flex: 1;
  display: flex;
  background-color: #f0f0f0;
`;
