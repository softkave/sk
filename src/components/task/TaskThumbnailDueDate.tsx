import { Tag, Typography } from "antd";
import moment from "moment";
import React from "react";
import { ITask } from "../../models/task/types";

export interface ITaskThumbnailDueDateProps {
  task: ITask;
  isInLastStatus?: boolean;
}

const TaskThumbnailDueDate: React.FC<ITaskThumbnailDueDateProps> = (props) => {
  const { task, isInLastStatus } = props;

  if (!task.dueAt || isInLastStatus) {
    return null;
  }

  const dueAt = moment(task.dueAt);
  const completedAt = moment(task.statusAssignedAt);
  const isDue = task.dueAt && Date.now() > dueAt.valueOf();
  const contentText = isInLastStatus
    ? `Completed ${completedAt.fromNow()}`
    : `Due ${dueAt.fromNow()}`;

  return (
    <Tag
      style={{
        backgroundColor: isDue ? "rgb(255, 77, 79)" : "white",
        textTransform: "capitalize",
        fontSize: "13px",
        borderRadius: "11px",
        color: isDue ? "white" : "black",
        border: isDue ? "1px solid rgba(255, 77, 79, 0)" : undefined,
      }}
    >
      <Typography.Text
        type="secondary"
        style={{
          marginRight: "0px",
          verticalAlign: "middle",
          fontSize: "13px",
          color: isDue ? "white" : "black",
        }}
      >
        {contentText}
      </Typography.Text>
    </Tag>
  );
};

export default React.memo(TaskThumbnailDueDate);
