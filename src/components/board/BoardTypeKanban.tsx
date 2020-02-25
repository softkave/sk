import React from "react";
import { IBlock } from "../../models/block/block";
import BoardBaskets, { GetBasketsFunc, IBoardBasket } from "./BoardBaskets";
import BoardBlockChildren from "./BoardChildren";
import BoardTypeList from "./BoardTypeList";
import Column from "./Column";
import { BoardResourceType } from "./types";

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

  if (
    selectedResourceType === "collaboration-requests" ||
    selectedResourceType === "collaborators" ||
    selectedResourceType === "groups"
  ) {
    return <BoardTypeList {...props} />;
  }

  const renderBaskets = (
    blocks: IBlock[],
    emptyMessage: string,
    getBaskets: GetBasketsFunc<IBoardBasket>,
    renderBasketFunc: RenderBasketFunc
  ) => {
    return (
      <BoardBaskets
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
      groups => groups.map(group => ({ key: group.customId, blocks: [group] })),
      groupBasket => {
        const g = groupBasket.blocks[0];
        return (
          <Column
            header={g.name}
            body={
              <BoardTypeList
                {...props}
                noPadding
                block={g}
                onClickBlock={blocks =>
                  onClickBlock(groupBasket.blocks.concat(blocks))
                }
              />
            }
          />
        );
      }
    );
  };

  return renderMainBlockChildren();
};

export default BoardTypeKanban;
