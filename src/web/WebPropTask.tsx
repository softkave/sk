import styled from "@emotion/styled";
import { Button, Switch } from "antd";
import React from "react";
import Priority from "../components/block/task/Priority";

const WebPropTask: React.SFC<{}> = props => {
  return (
    <StyledPropTask>
      <StyledPropTaskHeader>
        <Switch />
        <StyledPropTaskPriority>
          <Priority level="important" />
        </StyledPropTaskPriority>
      </StyledPropTaskHeader>
      <StyledPropTaskBody>{props.children}</StyledPropTaskBody>
      <StyledPropTaskControls>
        <Button icon="edit" />
        <Button icon="delete" type="danger" />
      </StyledPropTaskControls>
    </StyledPropTask>
  );
};

export default WebPropTask;

const StyledPropTask = styled.div`
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: white;
  width: 300px;
`;

const StyledPropTaskHeader = styled.div({});

const StyledPropTaskPriority = styled.div`
  margin-left: 16px;
  display: inline-block;
`;

const StyledPropTaskBody = styled.div`
  margin: 16px 0;
`;

const StyledPropTaskControls = styled.div`
  text-align: right;

  & button {
    margin-left: 8px;
  }
`;
