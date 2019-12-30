import styled from "@emotion/styled";
import React from "react";
import { IBlock } from "../../models/block/block";
import EmptyMessage from "../EmptyMessage";

const defaultEmptyMessage = "No blocks yet.";

export interface IBoardBasket {
  key: string;
  blocks: IBlock[];
}

export interface IBoardBasketsProps<BasketType extends IBoardBasket> {
  blocks: IBlock[];
  getBaskets: (blocks: IBlock[]) => BasketType[];
  renderBasket: (
    basket: BasketType,
    index: number,
    baskets: BasketType[]
  ) => React.ReactNode;
  emptyMessage?: string;
}

class BoardBaskets<T extends IBoardBasket> extends React.Component<
  IBoardBasketsProps<T>
> {
  public render() {
    const { blocks, getBaskets, renderBasket, emptyMessage } = this.props;
    const baskets = getBaskets(blocks);

    const renderBaskets = () => {
      return baskets.map((basket, index, allBaskets) => {
        const renderedBasket = renderBasket(basket, index, allBaskets);

        if (renderedBasket !== null) {
          return <StyledColumn key={basket.key}>{renderedBasket}</StyledColumn>;
        }

        return null;
      });
    };

    if (baskets.length === 0) {
      return <EmptyMessage>{emptyMessage || defaultEmptyMessage}</EmptyMessage>;
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
  width: "100%"
});

const lastOfTypeSelector = "&:last-of-type";
const StyledColumn = styled.div({
  width: "100%",
  marginRight: "24px",

  [lastOfTypeSelector]: {
    marginRight: 0
  }
});
