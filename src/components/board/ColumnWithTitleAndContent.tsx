import styled from "@emotion/styled";
import { Badge } from "antd";
import React from "react";
import StyledContainer from "../styled/Container";
import Column from "./Column";

export interface IColumnWithTitleAndCountProps {
  count: number;
  title?: React.ReactNode;
  body?: React.ReactNode;
}

const ColumnWithTitleAndCount: React.FC<IColumnWithTitleAndCountProps> = props => {
  const { title, count, body } = props;

  const renderHeader = () => {
    return (
      title && (
        <StyledContainer s={{ width: "100%", flex: 1, height: "100%" }}>
          <StyledContainer s={{ flex: 1 }}>
            <StyledTitle>{title}</StyledTitle>
          </StyledContainer>
          <StyledColumnOtherContainer>
            <Badge count={count} />
          </StyledColumnOtherContainer>
        </StyledContainer>
      )
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
