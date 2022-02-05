import { Typography } from "antd";
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
    <Typography.Paragraph style={{ marginBottom: "0" }}>
      {task.name}
    </Typography.Paragraph>
  );
};

export default React.memo(TaskNameAndDescription);
