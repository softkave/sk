import styled from "@emotion/styled";
import React from "react";

const Column: React.SFC<{}> = props => {
  const { children } = props;

  return <ColumnContainer>{children}</ColumnContainer>;
};

const ColumnContainer = styled.div`
  display: flex;
  height: 100%;
  width: 300px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
`;

export default Column;
