import React from "react";
import styled from "@emotion/styled";
import { Input, Form, Button } from "antd";
import moment from "moment";

import ACFMessage from "./ACFMessage";
import ACFExpiresAt from "./ACFExpiresAt";
import FormError from "../FormError";

const ACF = React.memo(function ACF(props) {
  const {
    email,
    expiresAt,
    body,
    error,
    emailError,
    bodyError,
    onChange,
    onDelete
  } = props;

  return (
    <Container>
      <Form.Item
        label="Email Address"
        help={<FormError>{emailError}</FormError>}
      >
        <Input
          value={email}
          autoComplete="email"
          onChange={event => {
            onChange({ email: event.target.value });
          }}
        />
      </Form.Item>
      <Form.Item label="Message" help={<FormError>{bodyError}</FormError>}>
        <ACFMessage
          value={body}
          onChange={body => {
            onChange({ body });
          }}
        />
      </Form.Item>
      <Form.Item label="Expires At">
        <ACFExpiresAt
          value={expiresAt}
          minDate={moment()
            .subtract(1, "day")
            .endOf("day")}
          onChange={date => {
            onChange({ expiresAt: date });
          }}
        />
      </Form.Item>
      <Form.Item>
        {error && <FormError>{error}</FormError>}
        <Button block onClick={onDelete} type="danger">
          Delete
        </Button>
      </Form.Item>
    </Container>
  );
});

export default ACF;

const Container = styled.div({
  backgroundColor: "#f0f0f0",
  padding: "16px",
  paddingBottom: "1px",
  marginBottom: "16px"
});
