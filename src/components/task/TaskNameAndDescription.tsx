import { Space, Typography } from "antd";
import React from "react";
import { ITask } from "../../models/task/types";

export interface ITaskNameAndDescriptionProps {
  task: ITask;
}

const TaskNameAndDescription: React.FC<ITaskNameAndDescriptionProps> = (
  props
) => {
  const { task } = props;
  return (
    <Space direction="vertical" size={8}>
      <Typography.Paragraph style={{ marginBottom: "0" }}>
        {task.name}
      </Typography.Paragraph>
      {task.description && (
        <Typography.Paragraph
          style={{ marginBottom: "0" }}
          ellipsis={{ rows: 2 }}
          type="secondary"
        >
          {task.description}
        </Typography.Paragraph>
      )}
    </Space>
  );
};

export default React.memo(TaskNameAndDescription);
