import styled from "@emotion/styled";
import React from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
} from "react-beautiful-dnd";
import EmptyMessage from "../EmptyMessage";
import StyledContainer from "../styled/Container";

const defaultEmptyMessage = "No data yet.";

export interface IBoardBasket {
  key: string;
  items: any[];

  isDragDisabled?: boolean;
}

export type GetBasketsFunc<T> = (blocks: any[]) => T[];
export type RenderBasketFn<BasketType extends IBoardBasket> = (
  basket: BasketType,
  index: number,
  baskets: BasketType[],
  porvided?: DraggableProvided,
  snapshot?: DraggableStateSnapshot
) => React.ReactNode;

export interface IBoardBasketsProps<BasketType extends IBoardBasket> {
  id: string;
  blocks: any[];
  getBaskets: (blocks: any[]) => BasketType[];
  renderBasket: RenderBasketFn<BasketType>;

  dragType?: string;
  isDropDisabled?: boolean;
  isDragDisabled?: boolean;
  emptyMessage?: string;
  hideEmptyBaskets?: boolean;
  noDnD?: boolean;
  shouldRenderBasket?: (
    basket: BasketType,
    index: number,
    baskets: BasketType[]
  ) => boolean;
  sortBaskets?: (baskets: BasketType[]) => BasketType[];
}

class BoardBaskets<T extends IBoardBasket> extends React.Component<
  IBoardBasketsProps<T>
> {
  public render() {
    const {
      id,
      blocks,
      getBaskets,
      renderBasket,
      emptyMessage,
      hideEmptyBaskets,
      isDragDisabled,
      isDropDisabled,
      dragType,
      sortBaskets,
      noDnD,
      shouldRenderBasket: shouldRenderBasketFn,
    } = this.props;
    const baskets = getBaskets(blocks);

    const filterBaskets = (inputBaskets: T[]) => {
      return inputBaskets.filter((basket) => {
        return basket.items.length > 0;
      });
    };

    const renderBaskets = () => {
      const sortedBaskets = sortBaskets ? sortBaskets(baskets) : baskets;
      const iterBaskets = hideEmptyBaskets
        ? filterBaskets(sortedBaskets)
        : sortedBaskets;
      return iterBaskets.map((basket, index, allBaskets) => {
        const shouldRenderBasket = shouldRenderBasketFn
          ? shouldRenderBasketFn(basket, index, allBaskets)
          : true;

        if (shouldRenderBasket) {
          if (noDnD) {
            return (
              <div
                key={basket.key}
                style={{
                  height: "100%",
                  padding: "0 16px",
                  paddingTop: "16px",
                }}
              >
                {renderBasket(basket, index, allBaskets)}
              </div>
            );
          }

          // TODO: there is a multiple scroll parents warning while dragging
          return (
            <Draggable
              isDragDisabled={isDragDisabled || basket.isDragDisabled}
              key={basket.key}
              draggableId={basket.key}
              index={index}
            >
              {(provided, snapshot) => {
                return (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={{
                      height: "100%",
                      padding: "0 16px",
                      paddingTop: "16px",
                      backgroundColor: snapshot.isDragging ? "#eee" : "white",
                      ...provided.draggableProps.style,
                    }}
                  >
                    {renderBasket(
                      basket,
                      index,
                      allBaskets,
                      provided,
                      snapshot
                    )}
                  </div>
                );
              }}
            </Draggable>
          );
        }

        return null;
      });
    };

    if (baskets.length === 0) {
      return (
        <StyledContainer s={{ flex: 1, alignItems: "center" }}>
          <EmptyMessage>{emptyMessage || defaultEmptyMessage}</EmptyMessage>
        </StyledContainer>
      );
    }

    if (noDnD) {
      return (
        <StyledBasketsContainerInner>
          {renderBaskets()}
        </StyledBasketsContainerInner>
      );
    }

    return (
      <Droppable
        droppableId={id}
        type={dragType}
        direction="horizontal"
        isDropDisabled={isDropDisabled}
      >
        {(provided, snapshot) => {
          return (
            <StyledBasketsContainerInner
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {renderBaskets()}
              {provided.placeholder}
            </StyledBasketsContainerInner>
          );
        }}
      </Droppable>
    );
  }
}

const StyledBasketsContainerInner = styled.div({
  height: "100%",
  display: "flex",
  boxSizing: "border-box",
  width: "100%",
  overflowX: "auto",
  overflowY: "auto",
});

export default React.memo(BoardBaskets);
