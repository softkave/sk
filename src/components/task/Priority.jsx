import React from "react";
import { Tag } from "antd";

const priorityColors = {
  "not important": "yellow",
  important: "green",
  "very important": "red"
};

export default function Priority(props) {
  const { level } = props;
  return <Tag color={priorityColors[level]}>{level}</Tag>;
}
