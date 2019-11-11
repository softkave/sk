import styled from "@emotion/styled";
import React from "react";

export interface IColumnProps {
  className?: string;
}

const Column: React.SFC<IColumnProps> = props => {
  const { children, className } = props;

  return <ColumnContainer className={className}>{children}</ColumnContainer>;
};

const ColumnContainer = styled.div`
  display: flex;
  height: 100%;
  width: 300px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  flex-direction: column;
`;

export default Column;
