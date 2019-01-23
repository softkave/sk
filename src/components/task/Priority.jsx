import React from "react";
import "./priority.css";

export const priorityToColorMap = {
  "not important": "#EACA2C",
  important: "green",
  "very important": "red"
};

export default function Priority(props) {
  const { level, cover } = props;
  const style = {
    [cover ? "backgroundColor" : "color"]: priorityToColorMap[level]
  };

  return (
    <span className="sk-priority" style={style}>
      {level}
    </span>
  );
}
