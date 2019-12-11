import styled from "@emotion/styled";
import { Icon } from "antd";
import React from "react";

import BoardShell, { IBoardShellProps } from "./BoardShell";

const BoardLoading: React.SFC<IBoardShellProps> = props => {
  return (
    <BoardShell {...props}>
      <StyledLoadingIcon type="loading" />
    </BoardShell>
  );
};

export default BoardLoading;

const StyledLoadingIcon = styled(Icon)({
  fontSize: "48px",
  color: "rgb(66,133,244)"
});
