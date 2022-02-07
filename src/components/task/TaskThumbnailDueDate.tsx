import { Typography } from "antd";
import moment from "moment";
import React from "react";
import { ITask } from "../../models/task/types";

export interface ITaskThumbnailDueDateProps {
  task: ITask;
  isInLastStatus?: boolean;
}

const TaskThumbnailDueDate: React.FC<ITaskThumbnailDueDateProps> = (props) => {
  const { task, isInLastStatus } = props;

  if (!task.dueAt) {
    return null;
  }

  if (isInLastStatus) {
    return null;
  }

  const dueAt = moment(task.dueAt);
  const completedAt = moment(task.statusAssignedAt);
  const isDue = task.dueAt && Date.now() > dueAt.valueOf();
  const contentText = isInLastStatus
    ? `Completed ${completedAt.fromNow()}`
    : `Due ${dueAt.fromNow()}`;

  return (
    <Typography.Text
      type="secondary"
      style={{
        marginRight: "0px",
        color: isDue ? "rgb(255, 77, 79)" : undefined,
        verticalAlign: "middle",
        fontSize: "13px",
      }}
    >
      {contentText}
    </Typography.Text>
  );
};

export default React.memo(TaskThumbnailDueDate);
