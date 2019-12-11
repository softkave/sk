import { Result } from "antd";
import React from "react";
import BoardShell, { IBoardShellProps } from "./BoardShell";

// TODO: Display the original error that occurred
const BoardError: React.SFC<IBoardShellProps> = props => {
  return (
    <BoardShell {...props}>
      <Result status="error" title="Error">
        Error loading data
      </Result>
    </BoardShell>
  );
};

export default BoardError;
