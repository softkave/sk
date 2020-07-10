import React from "react";
import { BlockType, IBlock } from "../../models/block/block";
import BoardList from "../boardBlock/BoardList";
import CollaborationRequests from "../collaborator/CollaborationRequests";
import CollaboratorList from "../collaborator/CollaboratorList";
import LoadBlockChildren from "./LoadBlockChildren";
import { BoardResourceType } from "./types";

export interface IRenderBlockChildrenProps {
  block: IBlock;
  selectedResourceType: BoardResourceType;
  onClickBlock: (blocks: IBlock[]) => void;

  searchQuery?: string;
}

const RenderBlockChildren: React.FC<IRenderBlockChildrenProps> = (props) => {
  const { block, onClickBlock, selectedResourceType } = props;

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

    case "boards":
      return (
        <LoadBlockChildren
          parent={block}
          type={BlockType.Board}
          render={(blocks) => (
            <BoardList
              boards={blocks}
              onClick={(board) => onClickBlock([board])}
            />
          )}
        />
      );
  }

  return null;
};

export default React.memo(RenderBlockChildren);
