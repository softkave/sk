import React from "react";
import { Row, Col } from "antd";
import "./thumbnail.css";

const defaultThumbnailColor = "#aaa";
const defaultColorSpan = 4;

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
    // hoverable,
    color
  } = props;
  const cSpan = colorSpan;
  const thumbnailColor = data.color || color;

  return (
    <div
      className={
        "sk-thumbnail " +
        // (hoverable ? "sk-thumbnail-hoverable " : "") +
        (className || "")
      }
      style={style}
      onClick={onClick}
    >
      <Row gutter={16} style={{ height: "100%" }}>
        <Col span={cSpan} style={{ height: "60px" }}>
          <div
            style={{ backgroundColor: thumbnailColor, ...colorStyle }}
            className={"sk-thumbnail-color " + colorClassName}
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
  className: "",
  colorSpan: defaultColorSpan,
  colorClassName: "",
  color: defaultThumbnailColor
};
