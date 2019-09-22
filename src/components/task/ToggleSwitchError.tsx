import styled from "@emotion/styled";
import { Icon } from "antd";
import React from "react";

const ToggleSwitchError: React.SFC<{}> = () => {
  return <StyledToggleSwitchLoadingIcon type="close" />;
};

export default ToggleSwitchError;

const StyledToggleSwitchLoadingIcon = styled(Icon)({
  color: "red"
});
