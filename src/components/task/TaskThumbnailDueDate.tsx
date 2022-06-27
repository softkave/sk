import { Typography } from "antd";
import moment from "moment";
import React from "react";
import { ITask } from "../../models/task/types";
import SkTag from "../utilities/SkTag";

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
    <SkTag
      color={isDue ? "rgb(255, 77, 79)" : undefined}
      doNotLightenColor={!isDue}
    >
      <Typography.Text
        type="secondary"
        style={{
          marginRight: "0px",
          verticalAlign: "middle",
          color: isDue ? "inherit" : undefined,
        }}
      >
        {contentText}
      </Typography.Text>
    </SkTag>
  );
};

export default React.memo(TaskThumbnailDueDate);
