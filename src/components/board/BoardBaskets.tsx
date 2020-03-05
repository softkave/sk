import styled from "@emotion/styled";
import React from "react";
import EmptyMessage from "../EmptyMessage";
import StyledContainer from "../styled/Container";

const defaultEmptyMessage = "No blocks yet.";

export interface IBoardBasket {
  key: string;
  items: any[];
}

export type GetBasketsFunc<T> = (blocks: any[]) => T[];

export interface IBoardBasketsProps<BasketType extends IBoardBasket> {
  blocks: any[];
  getBaskets: (blocks: any[]) => BasketType[];
  renderBasket: (
    basket: BasketType,
    index: number,
    baskets: BasketType[]
  ) => React.ReactNode;
  emptyMessage?: string;
  hideEmptyBaskets?: boolean;
}

class BoardBaskets<T extends IBoardBasket> extends React.Component<
  IBoardBasketsProps<T>
> {
  public render() {
    const {
      blocks,
      getBaskets,
      renderBasket,
      emptyMessage,
      hideEmptyBaskets
    } = this.props;
    const baskets = getBaskets(blocks);

    const filterBaskets = () => {
      return baskets.filter(basket => {
        return basket.items.length > 0;
      });
    };

    const renderBaskets = () => {
      const iterBaskets = hideEmptyBaskets ? filterBaskets() : baskets;
      return iterBaskets.map((basket, index, allBaskets) => {
        const renderedBasket = renderBasket(basket, index, allBaskets);

        if (renderedBasket !== null) {
          return <StyledColumn key={basket.key}>{renderedBasket}</StyledColumn>;
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
      <StyledBasketsContainerInner>
        {renderBaskets()}
      </StyledBasketsContainerInner>
    );
  }
}

export default BoardBaskets;

const StyledBasketsContainerInner = styled.div({
  height: "100%",
  display: "flex",
  boxSizing: "border-box",
  width: "100%",
  overflowX: "auto",
  overflowY: "auto"
});

const StyledColumn = styled.div({
  height: "100%"
  // width: "100%"
});
