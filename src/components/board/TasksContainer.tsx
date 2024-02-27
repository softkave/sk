import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import forEach from "lodash/forEach";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  IBoard,
  IBoardLabel,
  IBoardStatus,
  IBoardStatusResolution,
} from "../../models/board/types";
import { ICollaborator } from "../../models/collaborator/types";
import { IAppWorkspace } from "../../models/organization/types";
import { ISprint } from "../../models/sprint/types";
import { ITask, ITaskFormValues } from "../../models/task/types";
import { IUser } from "../../models/user/types";
import { updateTaskOpAction } from "../../redux/operations/task/updateTask";
import OrganizationSelectors from "../../redux/organizations/selectors";
import SessionSelectors from "../../redux/session/selectors";
import SprintSelectors from "../../redux/sprints/selectors";
import { AppDispatch, IAppState } from "../../redux/types";
import UserSelectors from "../../redux/users/selectors";
import { indexArray } from "../../utils/utils";

export interface ITasksContainerRenderFnProps {
  board: IBoard;
  user: IUser;
  tasks: ITask[];
  tasksMap: Record<string, ITask>;
  collaborators: ICollaborator[];
  statusList: IBoardStatus[];
  resolutionsList: IBoardStatusResolution[];
  labelList: IBoardLabel[];
  sprints: ISprint[];
  labelsMap: { [key: string]: IBoardLabel };
  sprintsMap: { [key: string]: ISprint };
  statusMap: { [key: string]: IBoardStatus };
  resolutionsMap: { [key: string]: IBoardStatusResolution };
  onUpdateTask: (taskId: string, update: Partial<ITaskFormValues>) => Promise<void>;
}

export interface ITasksContainerProps {
  board: IBoard;
  useCurrentSprint: boolean;
  searchText?: string;
  render: (props: ITasksContainerRenderFnProps) => React.ReactElement;
}

const TasksContainer: React.FC<ITasksContainerProps> = (props) => {
  const { board, useCurrentSprint, searchText, render } = props;
  const user = useSelector<IAppState, IUser>((state) => {
    return SessionSelectors.assertGetUser(state);
  });

  const org = useSelector<IAppState, IAppWorkspace>((state) => {
    return OrganizationSelectors.assertGetOne(state, board.workspaceId || board.customId)!;
  });

  const sprints = useSelector<IAppState, ISprint[]>((state) => {
    const allSprints = SprintSelectors.getBoardSprints(state, board.customId);
    return allSprints;
  });

  const sprintsMap = indexArray(sprints, { path: "customId" });
  const collaboratorIds = org.collaboratorIds || [];
  const collaborators = useSelector<IAppState, ICollaborator[]>((state) => {
    return UserSelectors.getMany(state, collaboratorIds);
  });

  const statusList = React.useMemo(() => board.boardStatuses || [], [board.boardStatuses]);

  const statusMap = React.useMemo(() => indexArray(statusList, { path: "customId" }), [statusList]);

  const labelList = React.useMemo(() => board.boardLabels || [], [board.boardLabels]);

  const labelsMap = React.useMemo(() => indexArray(labelList, { path: "customId" }), [labelList]);

  const resolutionsList = React.useMemo(
    () => board.boardResolutions || [],
    [board.boardResolutions]
  );

  const resolutionsMap = React.useMemo(
    () => indexArray(resolutionsList, { path: "customId" }),
    [resolutionsList]
  );

  // TODO: how can we memoize previous filters to make search faster
  // TODO: return the blocks, then have a useMemo that finds the tasks
  //   OR: have a tasks directory in redux or localize tasks in boards
  const { tasks, tasksMap } = useSelector<
    IAppState,
    { tasks: ITask[]; tasksMap: Record<string, ITask> }
  >((state) => {
    const taskList: ITask[] = [];
    const tasksMap: Record<string, ITask> = {};
    forEach(state.tasks, (task) => {
      let selectTask = task.boardId === board.customId;
      if (selectTask && useCurrentSprint) {
        selectTask = task.taskSprint?.sprintId === board.currentSprintId;
      }

      if (selectTask) {
        taskList.push(task);
        tasksMap[task.customId] = task;
      }
    });

    let finalTaskList: ITask[] = [];
    if (!searchText) {
      finalTaskList = taskList;
    } else {
      const lowerSearchText = searchText.toLowerCase();
      finalTaskList = taskList.filter((task) => {
        return (
          task.name?.toLowerCase().includes(lowerSearchText) ||
          task.description?.toLowerCase().includes(lowerSearchText)
        );
      });
    }

    return {
      tasksMap,
      tasks: finalTaskList,
    };
  });

  const dispatch: AppDispatch = useDispatch();
  const onUpdateTask = React.useCallback(
    async (taskId: string, update: Partial<ITaskFormValues>) => {
      const hide = message.loading("Updating task...", 0);
      const result = await dispatch(
        updateTaskOpAction({
          taskId,
          data: update,
        })
      );

      const op = unwrapResult(result);
      hide();

      if (op.error) {
        message.error("Error updating task");
      }
    },
    [dispatch]
  );

  return render({
    board,
    user,
    tasks,
    tasksMap,
    collaborators,
    labelList,
    labelsMap,
    statusList,
    statusMap,
    sprints,
    sprintsMap,
    resolutionsList,
    resolutionsMap,
    onUpdateTask,
  });
};

export default TasksContainer;
