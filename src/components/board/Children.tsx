import React from "react";
import { IBlock } from "../../models/block/block";
import CollaborationRequests from "../collaborator/CollaborationRequests";
import CollaboratorList from "../collaborator/CollaboratorList";
import StyledContainer from "../styled/Container";
import GroupChildren from "./GroupChildren";
import ProjectChildren from "./ProjectChildren";
import TaskChildren from "./TaskChildren";
import { BoardResourceType } from "./types";

export interface IChildrenProps {
  block: IBlock;
  onClickUpdateBlock: (block: IBlock) => void;
  onClickBlock: (blocks: IBlock[]) => void;
  selectedResourceType: BoardResourceType;
}

const Children: React.FC<IChildrenProps> = props => {
  const {
    block,
    onClickUpdateBlock,
    onClickBlock,
    selectedResourceType
  } = props;

  const renderCollaborators = () => {
    return (
      <StyledContainer s={{ padding: "0 16px" }}>
        <CollaboratorList organization={block} />
      </StyledContainer>
    );
  };

  const renderCollaborationRequests = () => {
    return (
      <StyledContainer s={{ padding: "0 16px" }}>
        <CollaborationRequests organization={block} />
      </StyledContainer>
    );
  };

  switch (selectedResourceType) {
    case "collaboration-requests":
      return renderCollaborationRequests();

    case "collaborators":
      return renderCollaborators();

    case "groups":
      return <GroupChildren block={block} onClickBlock={onClickBlock} />;

    case "projects":
      return <ProjectChildren block={block} onClickBlock={onClickBlock} />;

    case "tasks":
      return (
        <TaskChildren block={block} onClickUpdateBlock={onClickUpdateBlock} />
      );
  }
};

export default Children;
