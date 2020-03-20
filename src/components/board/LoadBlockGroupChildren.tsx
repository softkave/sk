import React from "react";
import { IBlock } from "../../models/block/block";
import GroupList from "../group/GroupList";
import LoadBlockChildren from "./LoadBlockChildren";

export interface ILoadBlockGroupChildrenProps {
  block: IBlock;
  onClickBlock: (blocks: IBlock[]) => void;
}

const LoadBlockGroupChildren: React.FC<ILoadBlockGroupChildrenProps> = props => {
  const { block, onClickBlock } = props;

  const renderGroups = () => {
    return (
      <LoadBlockChildren
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

export default LoadBlockGroupChildren;
