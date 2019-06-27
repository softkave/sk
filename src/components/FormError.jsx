import React from "react";
import styled from "@emotion/styled";
import { Form } from "antd";

const StyledFormError = styled(Form.Item)({
  color: "red"
});

export default function FormError(props) {
  const { children } = props;

  return <StyledFormError>{children}</StyledFormError>;
}
