import styled from "@emotion/styled";
import { Button } from "antd";
import React from "react";
import WebPropTask from "./WebPropTask";

const WebBody: React.SFC<{}> = () => {
  return (
    <StyledWebBody>
      <StyledWebBodyContent>
        <Button block type="primary">
          Signup
        </Button>
        <StyledWebPropTaskWrapper>
          <WebPropTask>
            <ul>
              <li>Manage Tasks</li>
              <li>Manage Projects</li>
              <li>Manage Groups</li>
            </ul>
          </WebPropTask>
        </StyledWebPropTaskWrapper>
        <Button block type="primary">
          Login
        </Button>
      </StyledWebBodyContent>
    </StyledWebBody>
  );
};

export default WebBody;

const StyledWebBody = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

const StyledWebBodyContent = styled.div`
  display: inline-block;
  text-align: left;
  margin: auto;
`;

const StyledWebPropTaskWrapper = styled.div`
  margin: 24px 0;
`;
