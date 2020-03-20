import { PlusOutlined } from "@ant-design/icons";
import React from "react";
import { BlockType, IBlock } from "../../models/block/block";
import BlockThumbnail from "../block/BlockThumnail";
import StyledContainer from "../styled/Container";
import StyledFlatButton from "../styled/FlatButton";
import wrapWithMargin from "../utilities/wrapWithMargin";
import BoardBaskets, { GetBasketsFunc, IBoardBasket } from "./BoardBaskets";
import BoardTypeList from "./BoardTypeList";
import Column from "./Column";
import BoardBlockChildren from "./LoadBlockChildren";
import RenderBlockChildren from "./RenderBlockChildren";
import SelectBlockOptionsMenu, {
  SettingsMenuKey
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

type RenderBasketFunc = (basket: IBoardBasket) => React.ReactNode;

const BoardTypeKanban: React.FC<IBoardTypeKanbanProps> = props => {
  const {
    block,
    selectedResourceType,
    onClickBlock,
    onClickCreateNewBlock,
    onClickDeleteBlock,
    onClickUpdateBlock
  } = props;
  const [
    hideEmptyGroups
    // setHideEmptyGroups
  ] = React.useState(false);

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

  const renderBaskets = (
    blocks: IBlock[],
    emptyMessage: string,
    getBaskets: GetBasketsFunc<IBoardBasket>,
    renderBasketFunc: RenderBasketFunc
  ) => {
    return (
      <BoardBaskets
        hideEmptyBaskets={hideEmptyGroups}
        blocks={blocks}
        emptyMessage={emptyMessage}
        getBaskets={getBaskets}
        renderBasket={basket => renderBasketFunc(basket)}
      />
    );
  };

  const onSelectSettingsMenuItem = (forBlock: IBlock, key: SettingsMenuKey) => {
    switch (key) {
      case "edit":
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
      onSelect={key => onSelectSettingsMenuItem(forBlock, key)}
    />
  );

  const renderGroupHeader = (group: IBlock) => {
    return (
      <StyledContainer s={{ width: "100%" }}>
        <StyledContainer s={{ flex: 1, marginRight: "8px" }}>
          <BlockThumbnail
            block={group}
            avatarSize="small"
            count={group[selectedResourceType]?.length}
            showFields={["name", "type"]}
          />
        </StyledContainer>
        <StyledContainer>
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

  const renderGroup = (groupBasket: IBoardBasket) => {
    const group = groupBasket.items[0];
    const childrenIDs = group[selectedResourceType!] || [];

    if (childrenIDs.length === 0 && hideEmptyGroups) {
      return null;
    }

    return (
      <Column
        header={renderGroupHeader(group)}
        body={
          <RenderBlockChildren
            {...props}
            block={group}
            onClickBlock={clickedBlockWithParents =>
              onClickBlock(groupBasket.items.concat(clickedBlockWithParents))
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
        flexDirection: "column"
      }}
    >
      {/* {renderToggleEmptyGroups()} */}
      <BoardBlockChildren
        parent={block}
        getChildrenIDs={() => block.groups || []}
        render={blocks =>
          renderBaskets(
            blocks,
            "No groups yet.",
            groups => {
              let baskets: IBoardBasket[] = [];

              if (
                block[selectedResourceType] &&
                (block[selectedResourceType] || []).length > 0
              ) {
                baskets.push({ key: block.customId, items: [block] });
              }

              baskets = baskets.concat(
                groups.map(group => ({ key: group.customId, items: [group] }))
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

export default BoardTypeKanban;
