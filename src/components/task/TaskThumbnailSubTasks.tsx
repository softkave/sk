import { css } from "@emotion/css";
import { Space, Typography } from "antd";
import React from "react";
import { ChevronDown, ChevronUp } from "react-feather";
import { ITask } from "../../models/task/types";
import TaskSubTask from "./TaskSubTask";

export interface ITaskThumbnailSubTasksProps {
  task: ITask;
  onToggleSubTask: (index: number) => Promise<void>;
}

const TaskThumbnailSubTasks: React.FC<ITaskThumbnailSubTasksProps> = (
  props
) => {
  const { task, onToggleSubTask } = props;
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
      <div
        onClick={() => setShowSubTasks(true)}
        className={css({
          cursor: "pointer",
          "&:hover": {
            "& *": { color: "rgb(66,133,244) !important" },
          },
        })}
      >
        <Space>
          <Typography.Text ellipsis type="secondary">
            Show subtasks ( {completedSubTasksCount} of {count} completed )
          </Typography.Text>
          <div>
            <ChevronDown
              style={{
                width: "18px",
                height: "18px",
                color: "rgba(0, 0, 0, 0.65)",
              }}
            />
          </div>
        </Space>
      </div>
    );
  }

  return (
    <Space
      direction="vertical"
      // className={css({
      //     "& *": {
      //         fontSize: "13px !important",
      //     },
      // })}
    >
      <div
        onClick={() => setShowSubTasks(false)}
        className={css({
          cursor: "pointer",
          "&:hover": {
            "& *": { color: "rgb(66,133,244) !important" },
          },
        })}
      >
        <Space>
          <Typography.Text type="secondary">Hide subtasks</Typography.Text>
          <div>
            <ChevronUp
              style={{
                width: "18px",
                height: "18px",
                color: "rgba(0, 0, 0, 0.65)",
              }}
            />
          </div>
        </Space>
      </div>
      {subTasks.map((subTask, i) => (
        <TaskSubTask
          key={subTask.customId}
          subTask={subTask}
          onToggleSubTask={() => onToggleSubTask(i)}
        />
      ))}
    </Space>
  );
};

export default React.memo(TaskThumbnailSubTasks);
