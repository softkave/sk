import { Tabs } from "antd";
import React from "react";
import { useRouteMatch } from "react-router";
import { BlockType, IBlock } from "../../models/block/block";
import useBlockChildrenTypes from "../hooks/useBlockChildrenTypes";
import BoardMain from "./BoardMain";
import { BoardResourceType, IBoardResourceTypePathMatch } from "./types";
import { getBlockResourceTypes, getBoardResourceTypeFullName } from "./utils";

export interface IBoardTypeTabsProps {
  blockPath: string;
  block: IBlock;
  isMobile: boolean;
  onClickUpdateBlock: (block: IBlock) => void;
  onClickAddBlock: (block: IBlock, type: BlockType) => void;
  onNavigate: (resourceType: BoardResourceType) => void;
  onClickBlock: (blocks: IBlock[]) => void;
  onClickAddCollaborator: () => void;
  onClickAddOrEditLabel: () => void;
  onClickAddOrEditStatus: () => void;
  onClickDeleteBlock: (block: IBlock) => void;
}

const BoardTypeTabs: React.FC<IBoardTypeTabsProps> = (props) => {
  const { block, blockPath, onNavigate } = props;

  const childrenTypes = useBlockChildrenTypes(block);
  const resourceTypes = getBlockResourceTypes(block, childrenTypes);
  const resourceTypeMatch = useRouteMatch<IBoardResourceTypePathMatch>(
    `${blockPath}/:resourceType`
  );
  const resourceType =
    resourceTypeMatch && resourceTypeMatch.params.resourceType;

  return (
    <Tabs
      defaultActiveKey={resourceType as any}
      onChange={(key) => onNavigate(key as BoardResourceType)}
    >
      {resourceTypes.map((type) => (
        <Tabs.TabPane key={type} tab={getBoardResourceTypeFullName(type)}>
          <BoardMain {...props} />
        </Tabs.TabPane>
      ))}
    </Tabs>
  );
};

export default BoardTypeTabs;
