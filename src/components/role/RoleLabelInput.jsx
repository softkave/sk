import React from "react";
import { Col, Row, Input, Button } from "antd";

export default function(props) {
  const { value, onCancel, onSubmit, onChange } = props;
  return (
    <Row gutter={16}>
      <Col span={20}>
        <Input
          allowClear
          onChange={onChange}
          onPressEnter={onSubmit}
          value={value}
        />
      </Col>
      <Col span={4}>
        <Button.Group>
          <Button type="danger" icon="close" onClick={onCancel} />
          <Button type="primary" onClick={onSubmit}>
            Ok
          </Button>
        </Button.Group>
      </Col>
    </Row>
  );
}
