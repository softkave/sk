import styled from "@emotion/styled";
import React from "react";
import { IBlock } from "../../models/block/block";
import StyledHorizontalScrollContainer from "../styled/HorizontalScrollContainer";

export interface IBBasket {
  key: string;
  blocks: IBlock[];
}

export interface IBProps<BasketType extends IBBasket> {
  blocks: IBlock[];
  getBaskets: (blocks: IBlock[]) => BasketType[];
  renderBasket: (
    basket: BasketType,
    index: number,
    baskets: BasketType[]
  ) => React.ReactNode;
}

class B<T extends IBBasket> extends React.Component<IBProps<T>> {
  public render() {
    const { blocks, getBaskets, renderBasket } = this.props;
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

    return (
      <StyledHorizontalScrollContainer>
        <StyledBasketsContainerInner>
          {renderBaskets()}
        </StyledBasketsContainerInner>
      </StyledHorizontalScrollContainer>
    );
  }
}

export default B;

const StyledBasketsContainerInner = styled.div({
  height: "100%",
  display: "flex",
  padding: "0 16px",
  boxSizing: "border-box"
});

const lastOfTypeSelector = "&:last-of-type";
const StyledColumn = styled.div({
  marginRight: 16,

  [lastOfTypeSelector]: {
    marginRight: 0
  }
});
