import React from "react";
import { Col, Row, Input, Button } from "antd";

export default class RoleLabelInput extends React.Component {
  render() {
    const {
      value,
      onCancel,
      onChange,
      onCompleteEdit,
      onChangeInput,
      getValue
    } = this.props;

    return (
      <Row>
        <Col span={16}>
          <Input
            allowClear
            onChange={event => onChangeInput(event, onChange, value)}
            onPressEnter={() => onCompleteEdit(onChange, value)}
            value={getValue(value)}
            autoFocus
            placeholder="Role name"
          />
        </Col>
        <Col span={8} style={{ textAlign: "right" }}>
          <Button
            type="danger"
            icon="close"
            onClick={onCancel}
            style={{ marginRight: "2px" }}
          />
          <Button
            type="primary"
            onClick={() => onCompleteEdit(onChange, value)}
          >
            Ok
          </Button>
        </Col>
      </Row>
    );
  }
}
