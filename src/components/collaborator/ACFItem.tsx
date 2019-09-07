import styled from "@emotion/styled";
import { Button, Form, Input } from "antd";
import moment from "moment";
import React from "react";

import FormError from "../FormError";
import ACFExpiresAt from "./ACFExpiresAt";
import ACFMessage from "./ACFMessage";

export interface IACFItemValue {
  email: string;
  body?: string;
  expiresAt?: number;
}

export interface IACFItemError {
  email?: string;
  body?: string;
  expiresAt?: string;
}

export interface IACFItemProps {
  value: IACFItemValue;
  onChange: (value: IACFItemValue) => void;
  onDelete: (value: IACFItemValue) => void;
  error?: IACFItemError;
}

const ACFItem = React.memo<IACFItemProps>(props => {
  const { error, onChange, onDelete, value } = props;
  const itemError = error || {};

  return (
    <Container>
      <Form.Item
        label="Email Address"
        help={<FormError>{itemError.email}</FormError>}
      >
        <Input
          value={value.email}
          autoComplete="email"
          onChange={event => {
            onChange({ ...value, email: event.target.value });
          }}
        />
      </Form.Item>
      <Form.Item label="Message" help={<FormError>{itemError.body}</FormError>}>
        <ACFMessage
          value={value.body}
          onChange={body => {
            onChange({ ...value, body });
          }}
        />
      </Form.Item>
      <Form.Item label="Expires At">
        <ACFExpiresAt
          value={value.expiresAt}
          minDate={moment()
            .subtract(1, "day")
            .endOf("day")}
          onChange={date => {
            onChange({ ...value, expiresAt: date });
          }}
        />
      </Form.Item>
      <Form.Item>
        <Button block onClick={() => onDelete(value)} type="danger">
          Delete
        </Button>
      </Form.Item>
    </Container>
  );
});

export default ACFItem;

const Container = styled.div({
  backgroundColor: "#f0f0f0",
  padding: "16px",
  paddingBottom: "1px",
  marginBottom: "16px"
});
