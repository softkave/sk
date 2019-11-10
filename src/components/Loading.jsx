import React from "react";
import { Icon } from "antd";
import styled from "@emotion/styled";
import StyledCenterContainer from "./styled/Center";

export default function Loading() {
  return (
    <StyledCenterContainer>
      <StyledIcon type="loading" />
    </StyledCenterContainer>
  );
}

const StyledIcon = styled(Icon)({
  fontSize: "2em",
  color: "rgb(66,133,244)"
});
