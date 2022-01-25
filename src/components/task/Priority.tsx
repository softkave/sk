import CaretDownOutlined from "@ant-design/icons/CaretDownOutlined";
import { Space, Typography } from "antd";
import React from "react";
import { BlockPriority } from "../../models/block/block";

export type TaskPriority = BlockPriority;
export const priorityToColorMap = {
  [BlockPriority.Medium]: "#EACA2C",
  [BlockPriority.High]: "#7ED321",
  [BlockPriority.Low]: "rgb(255, 77, 79)",
};

export const priorityToTextMap = {
  [BlockPriority.Medium]: "Low",
  [BlockPriority.High]: "Medium",
  [BlockPriority.Low]: "High",
};

interface IPriorityProps {
  level: TaskPriority;
  className?: string;
  withSelectIcon?: boolean;
}

const Priority: React.FC<IPriorityProps> = (props) => {
  const { level, className, withSelectIcon } = props;
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

  return (
    <Typography.Text
      style={{
        color: priorityToColorMap[props.level],
        textTransform: "capitalize",
        fontSize: "13px",
      }}
      className={className}
    >
      {content}
    </Typography.Text>
  );
};

export default Priority;
