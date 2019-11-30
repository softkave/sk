import styled from "@emotion/styled";
import React from "react";
import { BlockPriority } from "../../models/block/block";

export type TaskPriority = BlockPriority;

const notImportantKey = "not important";
const veryImportantKey = "very important";
export const priorityToColorMap = {
  [notImportantKey]: "#EACA2C",
  important: "#7ED321",
  [veryImportantKey]: "rgb(255, 77, 79)"
};

interface IPriorityProps {
  level: TaskPriority;
  cover?: "background-color" | "color";
  className?: string;
}

const Priority: React.SFC<IPriorityProps> = props => {
  const { level, cover, className } = props;

  return (
    <StyledPriority level={level} cover={cover} className={className}>
      {level}
    </StyledPriority>
  );
};

const StyledPriority = styled("span")<IPriorityProps>(props => {
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

export default Priority;
