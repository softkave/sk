import styled from "@emotion/styled";
import React from "react";

export interface IColumnProps {
  className?: string;
  header?: React.ReactNode;
  body?: React.ReactNode;
}

const Column: React.FC<IColumnProps> = props => {
  const { className, header, body } = props;

  return (
    <ColumnContainer className={className}>
      {header && (
        <StyledColumnHeaderContainer>{header}</StyledColumnHeaderContainer>
      )}
      <StyledColumnBodyContainer>{body}</StyledColumnBodyContainer>
    </ColumnContainer>
  );
};

const ColumnContainer = styled.div`
  display: flex;
  height: 100%;
  width: 300px;
  flex-direction: column;
`;

const StyledColumnHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledColumnBodyContainer = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

export default Column;
