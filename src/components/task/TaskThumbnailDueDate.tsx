import ScheduleOutlined from "@ant-design/icons/ScheduleOutlined";
import { Space, Typography } from "antd";
import moment from "moment";
import React from "react";
import { IBlock } from "../../models/block/block";

export interface ITaskThumbnailDueDateProps {
  task: IBlock;
}

const TaskThumbnailDueDate: React.FC<ITaskThumbnailDueDateProps> = (props) => {
  const { task } = props;

  if (!task.dueAt) {
    return null;
  }

  return (
    <Space>
      <ScheduleOutlined style={{ fontSize: "16px" }} />
      <Typography.Text underline type="secondary">
        Due {moment(task.dueAt).fromNow()}
      </Typography.Text>
    </Space>
  );
};

export default React.memo(TaskThumbnailDueDate);
