import styled from "@emotion/styled";
import { Icon } from "antd";
import React from "react";

const ToggleSwitchError: React.FC<{}> = () => {
  return (
    <StyledToggleSwitchLoadingIcon>
      <Icon type="close" />
    </StyledToggleSwitchLoadingIcon>
  );
};

export default ToggleSwitchError;

const StyledToggleSwitchLoadingIcon = styled.div({
  color: "red"
});
