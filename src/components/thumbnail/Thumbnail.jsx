import React from "react";
import { Row, Col } from "antd";
import "./thumbnail.css";

export default function Thumbnail(props) {
  const { data, renderInfo, onClick, className, style } = props;
  console.log("thumbnail", data);
  return (
    <div
      className={"sk-thumbnail " + className}
      style={style}
      onClick={onClick}
    >
      <Row gutter={16} style={{ height: "100%" }}>
        <Col span={8} style={{ height: "100%" }}>
          <span
            style={{ backgroundColor: data.color }}
            className="sk-thumbnail-color"
          />
        </Col>
        <Col span={16} style={{ height: "100%" }}>
          {renderInfo(data)}
        </Col>
      </Row>
    </div>
  );
}

Thumbnail.defaultProps = {
  className: ""
};
