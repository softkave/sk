import styled from "@emotion/styled";
import { Icon } from "antd";
import isString from "lodash/isString";
import React from "react";
import StyledContainer from "./styled/Container";
import StyledFillAndCenterContainer from "./styled/FillAndCenterContainer";

export interface IGeneralErrorProps {
  error?: Error | string;
}

const GeneralError: React.FC<IGeneralErrorProps> = props => {
  const { error, children } = props;

  let errorMessage: React.ReactNode = children || "An error occurred.";

  if (isString(error)) {
    errorMessage = error;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <StyledFillAndCenterContainer>
      <StyledContainer s={{ maxWidth: "300px", fontWeight: "bold" }}>
        <StyledContainer s={{ color: "red", fontSize: "20px" }}>
          <Icon type="close-circle" theme="filled" />
        </StyledContainer>
        <StyledErrorMessage>{errorMessage}</StyledErrorMessage>
      </StyledContainer>
    </StyledFillAndCenterContainer>
  );
};

export default GeneralError;

const StyledErrorMessage = styled.div({
  display: "flex",
  flex: 1,
  marginLeft: "8px"
});
