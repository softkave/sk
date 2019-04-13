import React from "react";
import { Icon, Row, Col } from "antd";

export default function Loading() {
  return (
    <Row type="flex" align="middle" justify="center">
      <Col span="24" style={{ textAlign: "center" }}>
        <Icon
          type="loading"
          style={{ fontSize: "2em", color: "rgb(66,133,244)" }}
        />
      </Col>
    </Row>
  );
}
