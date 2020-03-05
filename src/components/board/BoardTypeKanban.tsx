import React from "react";
import { IBlock } from "../../models/block/block";
import StyledContainer from "../styled/Container";
import BoardBaskets, { GetBasketsFunc, IBoardBasket } from "./BoardBaskets";
import BoardBlockChildren from "./BoardChildren";
import BoardTypeList from "./BoardTypeList";
import Column from "./Column";
import { BoardResourceType } from "./types";

const StyledButton = StyledContainer.withComponent("button");

export interface IBoardTypeKanbanProps {
  block: IBlock;
  resourceTypes: BoardResourceType[];
  onClickUpdateBlock: (block: IBlock) => void;
  onClickBlock: (blocks: IBlock[]) => void;
  onNavigate: (resourceType: BoardResourceType) => void;
  selectedResourceType?: BoardResourceType;
}

type GetChildrenIDs = (block: IBlock) => string[];
type RenderBasketFunc = (basket: IBoardBasket) => React.ReactNode;

const BoardTypeKanban: React.FC<IBoardTypeKanbanProps> = props => {
  const { block, selectedResourceType, onClickBlock } = props;
  const [hideEmptyGroups, setHideEmptyGroups] = React.useState(true);

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

  const renderBlockChildren = (
    b,
    getChildrenIDs: GetChildrenIDs,
    emptyMessage: string,
    getBaskets: GetBasketsFunc<IBoardBasket>,
    renderBasketFunc: RenderBasketFunc
  ) => {
    return (
      <BoardBlockChildren
        parent={b}
        getChildrenIDs={() => getChildrenIDs(b)}
        render={blocks =>
          renderBaskets(blocks, emptyMessage, getBaskets, renderBasketFunc)
        }
      />
    );
  };

  const renderMainBlockChildren = () => {
    return renderBlockChildren(
      block,
      () => block.groups || [],
      "No groups yet.",
      groups => groups.map(group => ({ key: group.customId, items: [group] })),
      groupBasket => {
        const g = groupBasket.items[0];
        const c = g[props.selectedResourceType!] || [];

        if (c.length === 0 && hideEmptyGroups) {
          return null;
        }

        return (
          <Column
            header={g.name}
            body={
              <BoardTypeList
                {...props}
                noPadding
                block={g}
                onClickBlock={blocks =>
                  onClickBlock(groupBasket.items.concat(blocks))
                }
              />
            }
          />
        );
      }
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
      {renderToggleEmptyGroups()}
      {renderMainBlockChildren()}
    </StyledContainer>
  );
};

export default BoardTypeKanban;
