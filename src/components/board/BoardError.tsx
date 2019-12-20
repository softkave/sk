import React from "react";
import GeneralError from "../GeneralError";
import BoardShell, { IBoardShellProps } from "./BoardShell";

// TODO: Display the original error that occurred
const BoardError: React.SFC<IBoardShellProps> = props => {
  return (
    <BoardShell {...props}>
      <GeneralError error="Error loading blocks." />
    </BoardShell>
  );
};

export default BoardError;
