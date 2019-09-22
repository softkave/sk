import styled from "@emotion/styled";
import { Icon } from "antd";
import React from "react";

const ToggleSwitchLoading: React.SFC<{}> = () => {
  return <StyledToggleSwitchLoadingIcon type="loading" />;
};

export default ToggleSwitchLoading;

const StyledToggleSwitchLoadingIcon = styled(Icon)({
  color: "rgb(66,133,244)"
});
