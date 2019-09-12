import styled from "@emotion/styled";
import { Button } from "antd";
import React from "react";
import WebPropTask from "./WebPropTask";

const WebBody: React.SFC<{}> = () => {
  return (
    <StyledWebBody>
      <StyledWebBodyContent>
        {/* <StyledButtonContainer>
          <StyledButtonContainerContent>
            <Button block>
              <StyledButtonContent>Signup</StyledButtonContent>
            </Button>
          </StyledButtonContainerContent>
        </StyledButtonContainer> */}
        <StyledWebPropTasksWrapper>
          {/* <WebPropTask>
            <ul>
              <li>
                <StyledTaskContent>Manage Your Tasks</StyledTaskContent>
              </li>
              <li>
                <StyledTaskContent>Manage Your Projects</StyledTaskContent>
              </li>
              <li>
                <StyledTaskContent>Manage Groups</StyledTaskContent>
              </li>
            </ul>
          </WebPropTask> */}
          {/* <WebPropTask priority="not important">
            <StyledTaskContent>Manage</StyledTaskContent>
          </WebPropTask>
          <WebPropTask priority="important">
            <StyledTaskContent>Your</StyledTaskContent>
          </WebPropTask>
          <WebPropTask priority="very important">
            <StyledTaskContent>Tasks</StyledTaskContent>
          </WebPropTask> */}
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
        </StyledWebPropTasksWrapper>
        {/* <StyledButtonContainer>
          <StyledButtonContainerContent>
            <Button block>
              <StyledButtonContent>Login</StyledButtonContent>
            </Button>
          </StyledButtonContainerContent>
        </StyledButtonContainer> */}
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

const StyledButtonContainer = styled.div`
  min-width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledButtonContainerContent = styled.div`
  width: 300px;
`;

const StyledWebBodyContent = styled.div`
  // max-width: 300px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const StyledTaskWrapper = styled.div`
  display: inline-block;
  margin-left: 24px;

  // &:first-of-type {
  //   margin-left: 0;
  // }
`;

const StyledWebPropTasksWrapper = styled.div`
  margin: 24px 0;
`;

// const StyledTaskContent = styled.span`
//   font-weight: bold;
//   font-size: 18px;
// `;

const StyledTaskContent = styled.span`
  font-weight: bold;
  font-size: 24px;
`;

const StyledButtonContent = styled.span`
  // font-weight: bold;
  color: black;
`;
