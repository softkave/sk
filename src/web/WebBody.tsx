import styled from "@emotion/styled";
import React from "react";

import WebPropTask from "./WebPropTask";

const WebBody: React.SFC<{}> = () => {
  return (
    <StyledWebBody>
      <StyledWebBodyContent>
        <StyledTaskWrapper>
          <WebPropTask checked priority="not important">
            <StyledTaskContent>Manage</StyledTaskContent>
          </WebPropTask>
        </StyledTaskWrapper>
        <StyledTaskWrapper>
          <WebPropTask checked priority="important">
            <StyledTaskContent>Your</StyledTaskContent>
          </WebPropTask>
        </StyledTaskWrapper>
        <StyledTaskWrapper>
          <WebPropTask checked priority="very important">
            <StyledTaskContent>Tasks</StyledTaskContent>
          </WebPropTask>
        </StyledTaskWrapper>
      </StyledWebBodyContent>
    </StyledWebBody>
  );
};

export default WebBody;

const StyledWebBody = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledWebBodyContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const StyledTaskWrapper = styled.div`
  display: inline-block;
`;

const StyledTaskContent = styled.span`
  font-weight: bold;
  font-size: 24px;
`;
