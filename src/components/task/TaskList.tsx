import { css, cx } from "@emotion/css";
import React from "react";
import { ITask } from "../../models/task/types";
import { sortBlocksByPriority } from "../block/sortBlocks";
import { ITasksContainerRenderFnProps } from "../board/TasksContainer";
import List from "../styled/List";
import Task from "./Task";

export interface ITaskListProps extends ITasksContainerRenderFnProps {
  demo?: boolean;
  style?: React.CSSProperties;
  disableDragAndDrop?: boolean;
  className?: string;
  toggleForm?: (task: ITask) => void;
}

const classes = {
  taskContainer: css({
    paddingBottom: "16px",
  }),
  root: css({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    flex: 1,
  }),
};

const TaskList: React.FC<ITaskListProps> = (props) => {
  const { tasks, demo, style, className, toggleForm } = props;
  const tasksToRender = sortBlocksByPriority(tasks);
  const renderTask = (task: ITask, i: number) => {
    return (
      <div key={task.customId} className={classes.taskContainer}>
        <Task
          {...props}
          task={task}
          index={i}
          demo={demo}
          onEdit={toggleForm}
        />
      </div>
    );
  };

  const renderList = () => {
    return (
      <List
        dataSource={tasksToRender}
        emptyDescription="Create or add task."
        renderItem={renderTask}
      />
    );
  };

  return (
    <div style={style} className={cx(classes.root, className)}>
      {renderList()}
    </div>
  );
};

export default React.memo(TaskList);
