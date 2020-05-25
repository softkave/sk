import styled from "@emotion/styled";
import React from "react";
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
  baskets: BasketType[]
) => React.ReactNode;

export interface IBoardBasketsProps<BasketType extends IBoardBasket> {
  id: string;
  blocks: any[];
  getBaskets: (blocks: any[]) => BasketType[];
  renderBasket: RenderBasketFn<BasketType>;

  emptyMessage?: string;
  hideEmptyBaskets?: boolean;
  style?: React.CSSProperties;
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
      sortBaskets,
      style,
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

    return (
      <StyledBasketsContainerInner style={style}>
        {renderBaskets()}
      </StyledBasketsContainerInner>
    );
  }
}

const StyledBasketsContainerInner = styled.div({
  display: "flex",
  boxSizing: "border-box",
  width: "100%",
  overflowX: "auto",
  overflowY: "hidden",
});

export default React.memo(BoardBaskets);
