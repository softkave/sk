import CaretDownOutlined from "@ant-design/icons/CaretDownOutlined";
import { Space, Tag } from "antd";
import React from "react";
import { BlockPriority } from "../../models/block/block";

export type TaskPriority = BlockPriority;
export const priorityToColorMap = {
  [BlockPriority.Medium]: "#7ED321",
  [BlockPriority.High]: "rgb(255, 77, 79)",
  [BlockPriority.Low]: "#EACA2C",
};

export const priorityToTextMap = {
  [BlockPriority.Medium]: "Medium",
  [BlockPriority.High]: "High",
  [BlockPriority.Low]: "Low",
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

  return (
    <Tag
      style={{
        backgroundColor: priorityToColorMap[props.level],
        textTransform: "capitalize",
        fontSize: "13px",
        borderRadius: "11px",
        color: "white",
        border: "0px",
      }}
    >
      {content}
    </Tag>
  );
};

export default Priority;
