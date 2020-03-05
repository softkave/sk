import React from "react";
import { IBlock } from "../../models/block/block";
import GroupList from "../group/GroupList";
import BoardBlockChildren from "./LoadBlockChildren";

export interface IGroupChildrenProps {
  block: IBlock;
  onClickBlock: (blocks: IBlock[]) => void;
}

const GroupChildren: React.FC<IGroupChildrenProps> = props => {
  const { block, onClickBlock } = props;

  const renderGroups = () => {
    return (
      <BoardBlockChildren
        parent={block}
        getChildrenIDs={() => block.groups || []}
        render={groups => (
          <GroupList groups={groups} onClick={group => onClickBlock([group])} />
        )}
      />
    );
  };

  return renderGroups();
};

export default GroupChildren;
