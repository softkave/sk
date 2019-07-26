import React from "react";
import styled from "@emotion/styled";

const StyledFormError = styled.div({
  color: "red",
  lineHeight: "24px",
  padding: "8px 0"
});

export default function FormError(props) {
  const { children, error } = props;

  return (
    <StyledFormError>
      {children}
      {[].concat(error).map(nextError => nextError)}
    </StyledFormError>
  );
}

FormError.defaultProps = {
  error: []
};
