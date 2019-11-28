import React from "react";
import { Icon } from "antd";
import styled from "@emotion/styled";
import StyledCenterContainer from "./styled/CenterContainer";
import StyledFlexFillContainer from "./styled/FillContainer";

export default function Loading() {
  return (
    <StyledFlexFillContainer>
      <StyledCenterContainer>
        <StyledIcon type="loading" />
      </StyledCenterContainer>
    </StyledFlexFillContainer>
  );
}

const StyledIcon = styled(Icon)({
  fontSize: "50px",
  color: "rgb(66,133,244)"
});
