import styled from "@emotion/styled";
import React from "react";
import Column from "./Column";

const KanbanBoard: React.SFC<{}> = props => {
  const { children } = props;
  return null;
};

export default KanbanBoard;

const StyledColumn = styled(Column)({
  maxWidth: 300,
  marginRight: 16,

  "&:last-of-type": {
    marginRight: 0
  }
});
