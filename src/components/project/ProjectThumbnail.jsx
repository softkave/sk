import React from "react";
import { Row, Col } from "antd";

export default function ProjectThumbnail(props) {
  const { project } = props;
  return (
    <div>
      <Row>
        <Col>
          <span style={{ backgroundColor: project.color }} />
        </Col>
        <Col>
          <h5>{project.name}</h5>
        </Col>
      </Row>
    </div>
  );
}
