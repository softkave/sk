import React from "react";
import { IBlock } from "../../models/block/block";
import CollaborationRequests from "../collaborator/CollaborationRequests";
import CollaboratorList from "../collaborator/CollaboratorList";
import LoadBlockGroupChildren from "./LoadBlockGroupChildren";
import LoadBlockProjects from "./LoadBlockProjects";
import LoadBlockTasks from "./LoadBlockTasks";
import { BoardResourceType } from "./types";

export interface IRenderBlockChildrenProps {
  block: IBlock;
  selectedResourceType: BoardResourceType;
  onClickUpdateBlock: (block: IBlock) => void;
  onClickBlock: (blocks: IBlock[]) => void;
}

const RenderBlockChildren: React.FC<IRenderBlockChildrenProps> = props => {
  const {
    block,
    onClickUpdateBlock,
    onClickBlock,
    selectedResourceType
  } = props;

  const renderCollaborators = () => {
    return <CollaboratorList organization={block} />;
  };

  const renderCollaborationRequests = () => {
    return <CollaborationRequests organization={block} />;
  };

  switch (selectedResourceType) {
    case "collaboration-requests":
      return renderCollaborationRequests();

    case "collaborators":
      return renderCollaborators();

    case "groups":
      return (
        <LoadBlockGroupChildren block={block} onClickBlock={onClickBlock} />
      );

    case "projects":
      return <LoadBlockProjects block={block} onClickBlock={onClickBlock} />;

    case "tasks":
      return (
        <LoadBlockTasks block={block} onClickUpdateBlock={onClickUpdateBlock} />
      );
  }

  console.log({ props });
};

export default RenderBlockChildren;
