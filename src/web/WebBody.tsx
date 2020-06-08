import React from "react";
import StyledContainer from "../components/styled/Container";
import wrapWithMargin from "../components/utilities/wrapWithMargin";
import CollaborationRequestWebItem from "./items/CollaborationRequestWebItem";
import ContainerBlocksWebItem from "./items/ContainerBlocksWebItem";
import LabelAndStatusWebItem from "./items/LabelAndStatusWebItem";
import TasksWebItem from "./items/TaskWebItem";

const WebBody: React.SFC<{}> = () => {
  return (
    <StyledContainer
      s={{
        flexDirection: "column",
        width: "100%",
        flex: 1,
        maxWidth: "750px",
        margin: "auto",
      }}
    >
      {wrapWithMargin(<ContainerBlocksWebItem />, 0, 0, 48, 48)}
      {wrapWithMargin(<TasksWebItem />, 0, 0, 0, 48)}
      {wrapWithMargin(<LabelAndStatusWebItem />, 0, 0, 0, 48)}
      {wrapWithMargin(<CollaborationRequestWebItem />, 0, 0, 0, 48)}
    </StyledContainer>
  );
};

export default WebBody;
