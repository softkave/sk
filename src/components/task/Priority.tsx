import { Tag } from "antd";
import React from "react";
import { BlockPriority } from "../../models/block/block";

export type TaskPriority = BlockPriority;

export const priorityToColorMap = {
  [BlockPriority.NotImportant]: "#EACA2C",
  [BlockPriority.Important]: "#7ED321",
  [BlockPriority.VeryImportant]: "rgb(255, 77, 79)",
};

interface IPriorityProps {
  level: TaskPriority;
  // cover?: "background-color" | "color";
  className?: string;
}

const Priority: React.FC<IPriorityProps> = (props) => {
  const { level, className } = props;

  return (
    <Tag color={priorityToColorMap[props.level]} className={className}>
      {level}
    </Tag>
  );

  // return (
  //   <StyledPriority level={level} cover={cover} className={className}>
  //     {level}
  //   </StyledPriority>
  // );
};

// const StyledPriority = styled("span")<IPriorityProps>((props) => {
//   const coverProp = props.cover === "color" ? "color" : "backgroundColor";
//   const color = priorityToColorMap[props.level];

//   return {
//     padding: "1px 8px 0px 8px",
//     borderRadius: "4em",
//     color: "white",
//     fontSize: "13.33px",
//     [coverProp]: color,
//     display: "inline-block",
//   };
// });

export default Priority;
