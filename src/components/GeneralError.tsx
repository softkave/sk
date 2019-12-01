import styled from "@emotion/styled";
import { Icon } from "antd";
import isString from "lodash/isString";
import React from "react";

export interface IGeneralErrorProps {
  error?: Error | string;
}

const GeneralError: React.SFC<IGeneralErrorProps> = props => {
  const { error, children } = props;

  let errorMessage: React.ReactNode = children || "An error occurred.";

  if (isString(error)) {
    errorMessage = error;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <StyledContainer>
      <StyledIcon type="close-circle" />
      <StyledErrorMessage>{errorMessage}</StyledErrorMessage>
    </StyledContainer>
  );
};

export default GeneralError;

const StyledContainer = styled.div({
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  margin: "16px 0"
});

const StyledErrorMessage = styled.div({
  display: "flex",
  flex: 1,
  marginLeft: "8px"
});

const StyledIcon = styled(Icon)({
  color: "red"
});
