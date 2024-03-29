import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import assert from "assert";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SystemResourceType } from "../../models/app/types";
import { IBoard } from "../../models/board/types";
import { ICollaborator } from "../../models/collaborator/types";
import { appMessages } from "../../models/messages";
import { IAppWorkspace } from "../../models/organization/types";
import { ISprint } from "../../models/sprint/types";
import { getCurrentAndUpcomingSprints } from "../../models/sprint/utils";
import { ITask, ITaskFormValues } from "../../models/task/types";
import { newTaskForm } from "../../models/task/utils";
import BoardSelectors from "../../redux/boards/selectors";
import MapsSelectors from "../../redux/maps/selectors";
import { createTaskOpAction } from "../../redux/operations/task/createTask";
import { updateTaskOpAction } from "../../redux/operations/task/updateTask";
import OrganizationSelectors from "../../redux/organizations/selectors";
import SessionSelectors from "../../redux/session/selectors";
import SprintSelectors from "../../redux/sprints/selectors";
import { AppDispatch, IAppState } from "../../redux/types";
import { flattenErrorList, indexArray } from "../../utils/utils";
import { IFormError } from "../utils/types";
import TaskForm from "./TaskForm";

export interface ITaskFormContainerProps {
  orgId: string;
  onClose: () => void;
  board?: IBoard;
  task?: ITask;
}

function taskToTaskForm(task: ITask): ITaskFormValues {
  return {
    name: task.name,
    description: task.description,
    dueAt: task.dueAt,
    boardId: task.boardId,
    workspaceId: task.workspaceId,
    assignees: task.assignees,
    priority: task.priority,
    subTasks: task.subTasks,
    labels: task.labels,
    status: task.status,
    taskResolution: task.taskResolution,
    taskSprint: task.taskSprint,
  };
}

const TaskFormContainer: React.FC<ITaskFormContainerProps> = (props) => {
  const { onClose, orgId } = props;
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector(SessionSelectors.assertGetUser);
  const org = useSelector<IAppState, IAppWorkspace>((state) => {
    return OrganizationSelectors.assertGetOne(state, orgId)!;
  });

  const [boardId, setBoardId] = React.useState(props.board?.customId || props.task?.boardId);
  const board = useSelector<IAppState, IBoard | undefined>((state) => {
    if (boardId) {
      return BoardSelectors.getOne(state, boardId);
    } else if (props.board) {
      return props.board;
    } else if (props.task) {
      return BoardSelectors.getOne(state, props.task.boardId!);
    }
  });

  assert(board, appMessages.boardNotFound);
  const sprints = useSelector<IAppState, ISprint[]>((state) => {
    const totalSprints = SprintSelectors.getBoardSprints(state, board!.customId);
    return getCurrentAndUpcomingSprints(totalSprints);
  });

  const sprintsMap = indexArray(sprints, { path: "customId" });
  const statusMap = React.useMemo(
    () => indexArray(board.boardStatuses, { path: "customId" }),
    [board.boardStatuses]
  );

  const labelsMap = React.useMemo(
    () => indexArray(board.boardLabels, { path: "customId" }),
    [board.boardLabels]
  );

  const resolutionsMap = React.useMemo(
    () => indexArray(board.boardResolutions, { path: "customId" }),
    [board.boardResolutions]
  );

  const collaborators = useSelector<IAppState, ICollaborator[]>((state) =>
    MapsSelectors.getList(state, SystemResourceType.User, org.collaboratorIds)
  );

  const [existingTask, setExistingTask] = React.useState<ITask | undefined>(() => props.task);
  const [taskFormData, setTaskFormData] = React.useState<ITaskFormValues>(() =>
    props.task ? taskToTaskForm(props.task) : newTaskForm(board)
  );

  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<IFormError<Record<string, any>> | undefined>();
  const possibleParents = useSelector<IAppState, IBoard[]>((state) => {
    return BoardSelectors.filter(state, (item) => item.workspaceId === orgId);
  });

  const onSubmit = async (values: ITaskFormValues) => {
    const data = { ...taskFormData, ...values };
    setLoading(true);
    setTaskFormData(data);
    const result = existingTask
      ? await dispatch(
          updateTaskOpAction({
            data,
            taskId: existingTask.customId,
          })
        )
      : await dispatch(
          createTaskOpAction({
            task: data,
          })
        );

    const op = unwrapResult(result);
    const block = op.value;
    setLoading(false);

    if (op.error) {
      if (existingTask) {
        message.error("Error updating task");
      } else {
        message.error("Error creating task");
      }

      const flattenedErrors = flattenErrorList(op.error);
      setErrors({
        errors: flattenedErrors,
        errorList: op.error,
      });
    } else {
      if (existingTask) {
        message.success("Task updated");
      } else {
        message.success("Task created");
      }

      setExistingTask(block ?? undefined);
    }
  };

  return (
    <TaskForm
      value={taskFormData as any}
      collaborators={collaborators}
      labelList={board.boardLabels}
      labelsMap={labelsMap}
      statusList={board.boardStatuses}
      resolutionsList={board.boardResolutions}
      user={user}
      onClose={onClose}
      task={existingTask}
      onSubmit={onSubmit}
      isSubmitting={loading}
      errors={errors?.errors}
      possibleBoardParents={possibleParents}
      onChangeParent={setBoardId}
      board={board}
      sprints={sprints}
      sprintsMap={sprintsMap}
      statusMap={statusMap}
      resolutionsMap={resolutionsMap}
    />
  );
};

export default React.memo(TaskFormContainer);
