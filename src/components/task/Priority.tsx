import styled from "@emotion/styled";
import React from "react";

export type TaskPriority = "very important" | "important" | "not important";

export const priorityToColorMap = {
  "not important": "#EACA2C",
  important: "#7ED321",
  // "very important": "#EB5424"
  "very important": "rgb(255, 77, 79)"
};

interface IStyledPriorityProps {
  level: TaskPriority;
  cover: "background-color" | "color";
}

const StyledPriority = styled("span")<IStyledPriorityProps>({}, props => {
  const coverProp = props.cover === "color" ? "color" : "backgroundColor";
  const color = priorityToColorMap[props.level];

  return {
    padding: "2px 8px",
    borderRadius: "4em",
    color: "white",
    fontSize: "13.33px",
    [coverProp]: color
  };
});

export default function Priority(props) {
  const { level, cover } = props;

  return (
    <StyledPriority level={level} cover={cover}>
      {level}
    </StyledPriority>
  );
}
