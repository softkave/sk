import React from "react";
import { IBlock } from "../../models/block/block";
import BlockThumbnail from "../block/BlockThumnail";
import StyledContainer from "../styled/Container";
import BoardBaskets, { GetBasketsFunc, IBoardBasket } from "./BoardBaskets";
import BoardTypeList from "./BoardTypeList";
import Children from "./Children";
import Column from "./Column";
import BoardBlockChildren from "./LoadBlockChildren";
import { BoardResourceType } from "./types";

const StyledButton = StyledContainer.withComponent("button");

export interface IBoardTypeKanbanProps {
  block: IBlock;
  onClickUpdateBlock: (block: IBlock) => void;
  onClickBlock: (blocks: IBlock[]) => void;
  selectedResourceType: BoardResourceType;
}

type RenderBasketFunc = (basket: IBoardBasket) => React.ReactNode;

const BoardTypeKanban: React.FC<IBoardTypeKanbanProps> = props => {
  const { block, selectedResourceType, onClickBlock } = props;
  const [hideEmptyGroups, setHideEmptyGroups] = React.useState(false);

  if (
    selectedResourceType === "collaboration-requests" ||
    selectedResourceType === "collaborators" ||
    selectedResourceType === "groups"
  ) {
    return <BoardTypeList {...props} />;
  }

  const toggleHideEmptyGroups = () => {
    setHideEmptyGroups(!hideEmptyGroups);
  };

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

  const renderGroupThumbnail = (group: IBlock) => {
    return (
      <BlockThumbnail
        block={group}
        avatarSize="small"
        count={group[selectedResourceType]?.length}
        showFields={["name"]}
      />
    );
  };

  const renderGroup = groupBasket => {
    const g = groupBasket.items[0];
    const c = g[props.selectedResourceType!] || [];

    if (c.length === 0 && hideEmptyGroups) {
      return null;
    }

    return (
      <Column
        header={renderGroupThumbnail(g)}
        body={
          <Children
            {...props}
            block={g}
            onClickBlock={clickedBlockWithParents =>
              onClickBlock(groupBasket.items.concat(clickedBlockWithParents))
            }
          />
        }
      />
    );
  };

  const renderToggleEmptyGroups = () => {
    let content: React.ReactNode = null;

    if (hideEmptyGroups) {
      content = "Show Empty Groups";
    } else {
      content = "Hide Empty Groups";
    }

    return (
      <StyledContainer
        s={{
          justifyContent: "flex-end",
          marginBottom: "20px",
          padding: "0 16px"
        }}
      >
        <StyledButton
          s={{
            color: "rgb(66,133,244)",
            border: "none",
            backgroundColor: "inherit",
            cursor: "pointer"
          }}
          onClick={toggleHideEmptyGroups}
        >
          {content}
        </StyledButton>
      </StyledContainer>
    );
  };

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
            groups =>
              groups.map(group => ({ key: group.customId, items: [group] })),
            renderGroup
          )
        }
      />
    </StyledContainer>
  );
};

export default BoardTypeKanban;
