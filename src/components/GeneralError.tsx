import styled from "@emotion/styled";
import { Icon } from "antd";
import isString from "lodash/isString";
import React from "react";
import StyledContainer from "./styled/Container";

export interface IGeneralErrorProps {
  error?: Error | string;
  fill?: boolean;
}

const GeneralError: React.FC<IGeneralErrorProps> = props => {
  const { error, children, fill } = props;

  let errorMessage: React.ReactNode = children || "An error occurred.";

  if (isString(error)) {
    errorMessage = error;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const a = (
    <StyledContainer>
      <StyledContainer s={{ maxWidth: "300px", fontWeight: "bold" }}>
        <StyledContainer s={{ color: "red", fontSize: "20px" }}>
          <Icon type="close-circle" theme="twoTone" twoToneColor="red" />
        </StyledContainer>
        <StyledErrorMessage>{errorMessage}</StyledErrorMessage>
      </StyledContainer>
    </StyledContainer>
  );

  if (fill) {
    return (
      <StyledContainer
        s={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px"
        }}
      >
        {a}
      </StyledContainer>
    );
  }

  return a;
};

export default GeneralError;

const StyledErrorMessage = styled.div({
  display: "flex",
  flex: 1,
  marginLeft: "8px"
});
