import ScheduleOutlined from "@ant-design/icons/ScheduleOutlined";
import { Space, Tag, Typography } from "antd";
import moment from "moment";
import React from "react";
import { Clock } from "react-feather";
import { IBlock } from "../../models/block/block";
import StyledContainer from "../styled/Container";

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
      <StyledContainer>
        <Clock
          style={{
            width: "16px",
            height: "16px",
            color: "rgba(0, 0, 0, 0.65)",
          }}
        />
      </StyledContainer>
      <Tag>
        <Typography.Text>Due {moment(task.dueAt).fromNow()}</Typography.Text>
      </Tag>
    </Space>
  );
};

export default React.memo(TaskThumbnailDueDate);
