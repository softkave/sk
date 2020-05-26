import path from "path";
import React from "react";
import { useSelector } from "react-redux";
import { useRouteMatch } from "react-router";
import { BlockType, IBlock } from "../../models/block/block";
import { IReduxState } from "../../redux/store";
import { noop } from "../../utils/utils";
import EmptyMessage from "../EmptyMessage";
import StyledContainer from "../styled/Container";
import BlockContainer from "./BlockContainer";
import BoardMain from "./BoardMain";
import BoardTypeList from "./BoardTypeList";
import {
  OnClickAddBlock,
  OnClickBlockWithSearchParamKey,
  OnClickDeleteBlock,
  OnClickUpdateBlock,
} from "./types";

const boardTypeSearchParamKey = "btGroup";

export interface IBoardGroupListProps {
  block: IBlock;
  blockPath: string;
  onClickUpdateBlock: OnClickUpdateBlock;
  onClickBlock: OnClickBlockWithSearchParamKey;
  onClickCreateNewBlock: OnClickAddBlock;
  onClickDeleteBlock: OnClickDeleteBlock;

  style?: React.CSSProperties;
}

interface IBoardGroupListSelectedGroup {
  groupId: string;
}

const BoardGroupList: React.FC<IBoardGroupListProps> = (props) => {
  const {
    block,
    onClickBlock,
    onClickCreateNewBlock,
    onClickUpdateBlock,
    onClickDeleteBlock,
    blockPath,
    style,
  } = props;
  const selectedGroupMatch = useRouteMatch<IBoardGroupListSelectedGroup>(
    path.normalize(`${blockPath}/groups/:groupId`)
  );

  const renderGroupList = () => {
    return (
      <BoardTypeList
        block={block}
        onClickBlock={(blocks) => onClickBlock(blocks, boardTypeSearchParamKey)}
        onClickCreateNewBlock={onClickCreateNewBlock}
        onClickUpdateBlock={onClickUpdateBlock}
        selectedResourceType="groups"
      />
    );
  };

  const renderSelectedGroupBoard = (group: IBlock) => {
    const groupPath = path.normalize(`${blockPath}/groups/${group.customId}`);
    return (
      <BoardMain
        isMobile={false}
        noExtraCreateMenuItems={true}
        block={group}
        blockPath={groupPath}
        onClickAddBlock={onClickCreateNewBlock}
        onClickAddCollaborator={noop}
        onClickAddOrEditLabel={noop}
        onClickAddOrEditStatus={noop}
        onClickBlock={onClickBlock}
        onClickDeleteBlock={onClickDeleteBlock}
        onClickUpdateBlock={onClickUpdateBlock}
        boardTypeSearchParamKey={boardTypeSearchParamKey}
      />
    );
  };

  const renderSelectedGroup = (groupId: string) => {
    return (
      <BlockContainer
        blockID={groupId}
        notFoundMessage="Group not found"
        render={renderSelectedGroupBoard}
      />
    );
  };

  return (
    <StyledContainer style={style} s={{ flex: 1, overflow: "hidden" }}>
      <StyledContainer
        s={{
          minWidth: "400px",
          maxWidth: "100%",
          overflow: "auto",
          height: "100%",
        }}
      >
        {renderGroupList()}
      </StyledContainer>
      {selectedGroupMatch && selectedGroupMatch.params.groupId ? (
        renderSelectedGroup(selectedGroupMatch.params.groupId)
      ) : (
        <EmptyMessage>Please, select a group</EmptyMessage>
      )}
    </StyledContainer>
  );
};

export default React.memo(BoardGroupList);
