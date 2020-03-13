import styled from "@emotion/styled";
import React from "react";
import WebBody2 from "./WebBody2";
import WebFooter from "./WebFooter";
import WebHeader from "./WebHeader";

const Web: React.SFC<{}> = () => {
  return (
    <StyledWeb>
      <WebHeader />
      <StyledWebBody>
        <WebBody2 />
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
  margin: 100px 0;
`;
