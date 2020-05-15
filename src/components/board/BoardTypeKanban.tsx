import { PlusOutlined } from "@ant-design/icons";
import React from "react";
import { DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";
import { BlockGroupContext, BlockType, IBlock } from "../../models/block/block";
import { sortItemsByPosition } from "../../utils/sortItemsByPosition";
import BlockThumbnail from "../block/BlockThumnail";
import StyledContainer from "../styled/Container";
import StyledFlatButton from "../styled/FlatButton";
import wrapWithMargin from "../utilities/wrapWithMargin";
import BoardBaskets, {
  GetBasketsFunc,
  IBoardBasket,
  RenderBasketFn,
} from "./BoardBaskets";
import BoardTypeList from "./BoardTypeList";
import Column from "./Column";
import BoardBlockChildren from "./LoadBlockChildren";
import RenderBlockChildren from "./RenderBlockChildren";
import SelectBlockOptionsMenu, {
  SettingsMenuKey,
} from "./SelectBlockOptionsMenu";
import { BoardResourceType } from "./types";
import { getBlockTypeFromResourceType } from "./utils";

// const StyledButton = StyledContainer.withComponent("button");

export interface IBoardTypeKanbanProps {
  block: IBlock;
  selectedResourceType: BoardResourceType;
  onClickUpdateBlock: (block: IBlock) => void;
  onClickBlock: (blocks: IBlock[]) => void;
  onClickCreateNewBlock: (block: IBlock, type: BlockType) => void;
  onClickDeleteBlock: (block: IBlock) => void;
}

const BoardTypeKanban: React.FC<IBoardTypeKanbanProps> = (props) => {
  const {
    block,
    selectedResourceType,
    onClickBlock,
    onClickCreateNewBlock,
    onClickDeleteBlock,
    onClickUpdateBlock,
  } = props;
  const [
    hideEmptyGroups,
    // setHideEmptyGroups
  ] = React.useState(() => {
    if (selectedResourceType === "projects") {
      return true;
    } else {
      return false;
    }
  });

  if (
    selectedResourceType === "collaboration-requests" ||
    selectedResourceType === "collaborators" ||
    selectedResourceType === "groups"
  ) {
    return <BoardTypeList {...props} />;
  }

  // const toggleHideEmptyGroups = () => {
  //   setHideEmptyGroups(!hideEmptyGroups);
  // };

  const shouldRenderBasket = (basket: IBoardBasket) => {
    const group: IBlock = basket.items[0];
    const childrenIDs = group[selectedResourceType!] || [];

    if (childrenIDs.length === 0 && hideEmptyGroups) {
      return false;
    }

    return true;
  };

  const getGroupContext = (): BlockGroupContext => {
    return selectedResourceType === "projects"
      ? "groupProjectContext"
      : "groupTaskContext";
  };

  // TODO: the sort function is getting called multiple times which can affect perf
  // look into it.
  const sortBaskets = (baskets: IBoardBasket[]) => {
    const ids = block[getGroupContext()] || [];
    const sortedBaskets = sortItemsByPosition(
      baskets,
      ids,
      (basket: IBoardBasket) => basket.key,
      "before"
    );

    return sortedBaskets;
  };

  const renderBaskets = (
    blocks: IBlock[],
    emptyMessage: string,
    getBaskets: GetBasketsFunc<IBoardBasket>,
    renderBasketFunc: RenderBasketFn<IBoardBasket>
  ) => {
    return (
      <BoardBaskets
        id={block.customId}
        dragType={getGroupContext()}
        hideEmptyBaskets={hideEmptyGroups}
        blocks={blocks}
        emptyMessage={emptyMessage}
        getBaskets={getBaskets}
        renderBasket={renderBasketFunc}
        shouldRenderBasket={shouldRenderBasket}
        sortBaskets={sortBaskets}
      />
    );
  };

  const onSelectSettingsMenuItem = (forBlock: IBlock, key: SettingsMenuKey) => {
    switch (key) {
      case "view":
        onClickUpdateBlock(forBlock);
        break;

      case "delete":
        onClickDeleteBlock(forBlock);
        break;
    }
  };

  const renderSettingsMenu = (forBlock: IBlock) => (
    <SelectBlockOptionsMenu
      block={forBlock}
      onSelect={(key) => onSelectSettingsMenuItem(forBlock, key)}
    />
  );

  const renderGroupHeader = (
    group: IBlock,
    provided?: DraggableProvided,
    snapshot?: DraggableStateSnapshot,
    isDragDisabled?: boolean
  ) => {
    const dragHandleProps = provided ? provided.dragHandleProps : {};

    return (
      <StyledContainer
        s={{
          width: "100%",
          cursor: isDragDisabled
            ? undefined
            : snapshot
            ? snapshot.isDragging
              ? "grabbing"
              : "grab"
            : undefined,
        }}
        {...dragHandleProps}
      >
        <StyledContainer s={{ flex: 1, marginRight: "8px" }}>
          <BlockThumbnail
            block={group}
            avatarSize="small"
            count={group[selectedResourceType]?.length}
            showFields={["name", "type"]}
          />
        </StyledContainer>
        <StyledContainer s={{ alignItems: "center" }}>
          <StyledFlatButton
            style={{ margin: "0 8px", cursor: "pointer" }}
            onClick={() =>
              onClickCreateNewBlock(
                group,
                getBlockTypeFromResourceType(selectedResourceType)!
              )
            }
          >
            <PlusOutlined />
          </StyledFlatButton>
          {wrapWithMargin(renderSettingsMenu(group), 8, 0)}
        </StyledContainer>
      </StyledContainer>
    );
  };

  const renderGroup: RenderBasketFn<IBoardBasket> = (
    groupBasket,
    index,
    baskets,
    provided,
    snapshot
  ) => {
    const group: IBlock = groupBasket.items[0];

    return (
      <Column
        header={renderGroupHeader(
          group,
          provided,
          snapshot,
          !!groupBasket.isDragDisabled
        )}
        body={
          <RenderBlockChildren
            {...props}
            block={group}
            onClickBlock={(clickedBlockWithParents) =>
              onClickBlock(
                // To fix navigation bug when clicking on projects from orgs in kanban view
                // NOTE: possible bug sourcelater on
                group.customId === block.customId
                  ? clickedBlockWithParents
                  : groupBasket.items.concat(clickedBlockWithParents)
              )
            }
          />
        }
      />
    );
  };

  // const renderToggleEmptyGroups = () => {
  //   let content: React.ReactNode = null;

  //   if (hideEmptyGroups) {
  //     content = "Show Empty Groups";
  //   } else {
  //     content = "Hide Empty Groups";
  //   }

  //   return (
  //     <StyledContainer
  //       s={{
  //         justifyContent: "flex-end",
  //         marginBottom: "20px",
  //         padding: "0 16px"
  //       }}
  //     >
  //       <StyledButton
  //         s={{
  //           color: "rgb(66,133,244)",
  //           border: "none",
  //           backgroundColor: "inherit",
  //           cursor: "pointer"
  //         }}
  //         onClick={toggleHideEmptyGroups}
  //       >
  //         {content}
  //       </StyledButton>
  //     </StyledContainer>
  //   );
  // };

  return (
    <StyledContainer
      s={{
        flex: 1,
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* {renderToggleEmptyGroups()} */}
      <BoardBlockChildren
        parent={block}
        getChildrenIDs={() => block.groups || []}
        render={(blocks) =>
          renderBaskets(
            blocks,
            "No groups yet.",
            (groups) => {
              let baskets: IBoardBasket[] = [];

              if (
                block[selectedResourceType] &&
                (block[selectedResourceType] || []).length > 0
              ) {
                baskets.push({
                  key: block.customId,
                  items: [block],
                  // isDragDisabled: true
                });
              }

              baskets = baskets.concat(
                groups.map((group) => ({ key: group.customId, items: [group] }))
              );
              return baskets;
            },
            renderGroup
          )
        }
      />
    </StyledContainer>
  );
};

export default React.memo(BoardTypeKanban);
