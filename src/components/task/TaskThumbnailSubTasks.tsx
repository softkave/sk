import { Checkbox, Space, Typography } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import StyledContainer from "../styled/Container";

export interface ITaskThumbnailSubTasksProps {
  task: IBlock;
}

const TaskThumbnailSubTasks: React.FC<ITaskThumbnailSubTasksProps> = (
  props
) => {
  const { task } = props;
  const [showSubTasks, setShowSubTasks] = React.useState(false);
  const subTasks = task.subTasks || [];
  const count = subTasks.length;

  if (count === 0) {
    return null;
  }

  const completedSubTasksCount = subTasks.filter(
    (subTask) => !!subTask.completedBy
  ).length;

  if (!showSubTasks) {
    return (
      <StyledContainer
        onClick={() => setShowSubTasks(true)}
        s={{
          cursor: "pointer",
          "&:hover": { "& *": { color: "rgb(66,133,244) !important" } },
        }}
      >
        <Typography.Text type="secondary">
          Show subtasks ( {completedSubTasksCount} of {count} completed )
        </Typography.Text>
      </StyledContainer>
    );
  }

  return (
    <Space direction="vertical">
      <StyledContainer
        onClick={() => setShowSubTasks(false)}
        s={{
          cursor: "pointer",
          "&:hover": { "& *": { color: "rgb(66,133,244) !important" } },
        }}
      >
        <Typography.Text type="secondary">Hide subtasks</Typography.Text>
      </StyledContainer>
      {subTasks.map((subTask, i) => (
        <StyledContainer key={subTask.customId}>
          <StyledContainer>
            <Checkbox disabled checked={!!subTask.completedBy} />
          </StyledContainer>
          <StyledContainer s={{ marginLeft: "16px", flex: 1 }}>
            {subTask.description}
          </StyledContainer>
        </StyledContainer>
      ))}
    </Space>
  );
};

export default React.memo(TaskThumbnailSubTasks);
