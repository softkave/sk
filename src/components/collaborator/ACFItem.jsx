import React from "react";
import styled from "@emotion/styled";
import { Input, Form, Button, Row, Col } from "antd";
import moment from "moment";
import ACFMessage from "./ACFMessage";
import ACFExpiresAt from "./ACFExpiresAt";

const StyledACFError = styled.span({
  color: "red"
});

function ACFError(props) {
  const { children } = props;

  return <StyledACFError>{children}</StyledACFError>;
}

const ACF = React.memo(function ACF(props) {
  const {
    email,
    expiresAt,
    message,
    error,
    emailError,
    messageError,
    onChange,
    onDelete
  } = props;

  return (
    <Row gutter={16}>
      <Col span={20}>
        <Form.Item
          label="Email Address"
          help={<ACFError>{emailError}</ACFError>}
        >
          <Input
            value={email}
            autoComplete="email"
            onChange={event => {
              onChange({ email: event.target.value });
            }}
          />
        </Form.Item>
        <Form.Item label="Message" help={<ACFError>{messageError}</ACFError>}>
          <ACFMessage
            value={message}
            onChange={message => {
              onChange({ message });
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
      </Col>
      <Col span={4}>
        <Button icon="close" onClick={onDelete} type="danger" />
      </Col>
      {error && <ACFError>{error}</ACFError>}
    </Row>
  );
});

export default ACF;
