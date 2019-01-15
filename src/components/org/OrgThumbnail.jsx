import React from "react";
import { Row, Col } from "antd";

export default function OrgThumbnail(props) {
  const { org } = props;
  return (
    <div>
      <Row>
        <Col>
          <span style={{ backgroundColor: org.color }} />
        </Col>
        <Col>
          <h5>{org.name}</h5>
        </Col>
      </Row>
    </div>
  );
}
