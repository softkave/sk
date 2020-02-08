import { Tabs } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import StyledContainer from "../styled/Container";
import BoardTypeList from "./BoardTypeList";
import { BoardResourceType } from "./types";
import { getBoardResourceTypeFullName } from "./utils";

export interface IBoardTypeTabsProps {
  block: IBlock;
  resourceTypes: BoardResourceType[];
  selectedResourceType: BoardResourceType;
  onClickUpdateBlock: (block: IBlock) => void;
  onClickBlock: (blocks: IBlock[]) => void;
  onNavigate: (resourceType: BoardResourceType) => void;
}

const BoardTypeTabs: React.FC<IBoardTypeTabsProps> = props => {
  const {
    block,
    onClickBlock,
    onClickUpdateBlock,
    resourceTypes,
    onNavigate,
    selectedResourceType
  } = props;

  return (
    <Tabs
      defaultActiveKey={selectedResourceType}
      onChange={key => onNavigate(key as BoardResourceType)}
    >
      {resourceTypes.map(type => (
        <Tabs.TabPane key={type} tab={getBoardResourceTypeFullName(type)}>
          <StyledContainer
            s={{ padding: "0 16px", width: "100%", height: "100%" }}
          >
            <BoardTypeList
              noPadding
              block={block}
              resourceTypes={resourceTypes}
              selectedResourceType={type}
              onClickBlock={onClickBlock}
              onClickUpdateBlock={onClickUpdateBlock}
              onNavigate={onNavigate}
            />
          </StyledContainer>
        </Tabs.TabPane>
      ))}
    </Tabs>
  );
};

export default BoardTypeTabs;
