import styled from "@emotion/styled";
import { Badge } from "antd";
import React from "react";
import StyledFlexFillContainer from "../styled/FillContainer";
import Column from "./Column";

export interface IColumnWithTitleAndCountProps {
  title: string;
  count: number;
  body?: React.ReactNode;
}

const ColumnWithTitleAndCount: React.FC<IColumnWithTitleAndCountProps> = props => {
  const { title, count, body } = props;

  const renderHeader = () => {
    return (
      <StyledFlexFillContainer>
        <StyledFlexFillContainer>
          <StyledTitle>{title}</StyledTitle>
        </StyledFlexFillContainer>
        <StyledColumnOtherContainer>
          <Badge count={count} />
        </StyledColumnOtherContainer>
      </StyledFlexFillContainer>
    );
  };

  if (count > 0) {
    return <Column header={renderHeader()} body={body} />;
  }

  return null;
};

export default ColumnWithTitleAndCount;

const StyledColumnOtherContainer = styled.div({
  marginLeft: "16px"
});

const StyledTitle = styled.div({
  fontWeight: "bold"
});
