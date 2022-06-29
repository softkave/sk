import path from "path-browserify";
import React from "react";
import { useHistory, useRouteMatch } from "react-router";
import { IBoard } from "../../models/board/types";
import { appBoardRoutes } from "../../models/board/utils";
import { ITask } from "../../models/task/types";
import useTask from "../hooks/useTask";

export default function useShowTaskForm(board: IBoard) {
  const history = useHistory();
  const boardPath = appBoardRoutes.board(board.rootBlockId, board.customId);
  const tasksPath = path.normalize(`${boardPath}/tasks`);
  const selectedTaskRouteMatch = useRouteMatch<{ taskId: string }>(
    `${tasksPath}/:taskId`
  );
  const isTaskFormRoute = !!selectedTaskRouteMatch;
  const taskData = useTask(selectedTaskRouteMatch?.params.taskId);
  const [taskForm, setTaskForm] = React.useState(false);
  const openTaskForm = React.useCallback(
    (task?: ITask) => {
      if (task) {
        history.push(`${tasksPath}/${task.customId}`);
      } else {
        setTaskForm(true);
      }
    },
    [tasksPath, history]
  );

  const closeTaskForm = React.useCallback(() => {
    setTaskForm(false);
    history.push(tasksPath);
  }, [history, tasksPath]);

  return {
    taskData,
    openTaskForm,
    closeTaskForm,
    showTaskForm: taskForm || isTaskFormRoute,
  };
}
