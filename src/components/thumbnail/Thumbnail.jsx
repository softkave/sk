import React from "react";
import { Row, Col } from "antd";
import "./thumbnail.css";

export default function Thumbnail(props) {
  const {
    data,
    renderInfo,
    onClick,
    className,
    style,
    colorStyle,
    colorClassName,
    colorSpan,
    hoverable
  } = props;
  console.log("thumbnail", data);
  const cSpan = colorSpan || 8;
  const hov = typeof hoverable !== "boolean" ? true : hoverable;

  return (
    <div
      className={
        "sk-thumbnail " +
        (hov ? "sk-thumbnail-hoverable " : "") +
        (className || "")
      }
      style={style}
      onClick={onClick}
    >
      <Row gutter={16} style={{ height: "100%" }}>
        <Col span={cSpan} style={{ height: "100%" }}>
          <span
            style={{ backgroundColor: data.color, ...colorStyle }}
            className={"sk-thumbnail-color " + (colorClassName || "")}
          />
        </Col>
        <Col span={24 - cSpan} style={{ height: "100%" }}>
          {renderInfo(data, props)}
        </Col>
      </Row>
    </div>
  );
}

Thumbnail.defaultProps = {
  className: ""
};
