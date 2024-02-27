import { Typography } from "antd";
import React from "react";
import { ITaskProps } from "../../../components/task/Task";
import WebCard from "./WebCard";

const TasksCard: React.FC<ITaskProps> = () => {
  return (
    <WebCard title={<Typography.Text strong>Task Management</Typography.Text>}>
      Softkave provides you tools for managing your tasks, from status tracking,
      to labels, and priorities and so on.
    </WebCard>
  );
};

export default TasksCard;
