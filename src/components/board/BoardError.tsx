import React from "react";

import BoardShell, { IBoardShellProps } from "./BoardShell";

const BoardError: React.SFC<IBoardShellProps> = props => {
  return <BoardShell {...props}>Error loading data</BoardShell>;
};

export default BoardError;
