import CaretDownOutlined from "@ant-design/icons/CaretDownOutlined";
import { Space } from "antd";
import React from "react";
import { TaskPriority } from "../../models/task/types";
import SkTag from "../utils/SkTag";

export const priorityToColorMap = {
  [TaskPriority.Medium]: "#7ED321",
  [TaskPriority.High]: "rgb(255, 77, 79)",
  [TaskPriority.Low]: "#EACA2C",
};

export const priorityToTextMap = {
  [TaskPriority.Medium]: "Medium",
  [TaskPriority.High]: "High",
  [TaskPriority.Low]: "Low",
};

interface IPriorityProps {
  level: TaskPriority;
  withSelectIcon?: boolean;
}

const Priority: React.FC<IPriorityProps> = (props) => {
  const { level, withSelectIcon } = props;
  const label = priorityToTextMap[level];
  let content: React.ReactNode = label;

  if (withSelectIcon) {
    content = (
      <Space>
        {label}
        <CaretDownOutlined style={{ fontSize: "10px" }} />
      </Space>
    );
  }

  return <SkTag color={priorityToColorMap[props.level]}>{content}</SkTag>;
};

export default Priority;
