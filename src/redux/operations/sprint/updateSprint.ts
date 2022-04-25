import { createAsyncThunk } from "@reduxjs/toolkit";
import { merge } from "lodash";
import { ISprint } from "../../../models/sprint/types";
import SprintAPI, { IUpdateSprintAPIParams } from "../../../net/sprint/sprint";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString, getNewId } from "../../../utils/utils";
import BoardActions from "../../boards/actions";
import BoardSelectors from "../../boards/selectors";
import SessionSelectors from "../../session/selectors";
import SprintActions from "../../sprints/actions";
import SprintSelectors from "../../sprints/selectors";
import TaskActions from "../../tasks/actions";
import { getSprintTasks } from "../../tasks/selectors";
import { IAppAsyncThunkConfig, IStoreLikeObject } from "../../types";
import {
  dispatchOperationCompleted,
  dispatchOperationError,
  dispatchOperationStarted,
  IOperation,
  isOperationStarted,
  wrapUpOpAction,
} from "../operation";
import OperationType from "../OperationType";
import OperationSelectors from "../selectors";
import { GetOperationActionArgs } from "../types";

export const updateSprintOpAction = createAsyncThunk<
  IOperation | undefined,
  GetOperationActionArgs<IUpdateSprintAPIParams>,
  IAppAsyncThunkConfig
>("op/sprint/updateSprint", async (arg, thunkAPI) => {
  const opId = arg.opId || getNewId();
  const operation = OperationSelectors.getOperationWithId(
    thunkAPI.getState(),
    opId
  );

  if (isOperationStarted(operation)) {
    return;
  }

  thunkAPI.dispatch(
    dispatchOperationStarted(opId, OperationType.UpdateSprint, arg.sprintId)
  );

  try {
    const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
    let sprint = SprintSelectors.getSprint(thunkAPI.getState(), arg.sprintId);
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());

    if (!isDemoMode) {
      const result = await SprintAPI.updateSprint({
        sprintId: arg.sprintId,
        data: {
          name: arg.data.name,
          duration: arg.data.duration,
        },
      });

      assertEndpointResult(result);
      sprint = result.sprint;
    } else {
      sprint = merge(sprint, arg.data, {
        updatedAt: getDateString(),
        updatedBy: user.customId,
      });

      if (arg.data.startDate) {
        sprint.startedBy = user.customId;
      } else if (arg.data.endDate) {
        sprint.endedBy = user.customId;
      }
    }

    completeUpdateSprint(
      thunkAPI,
      sprint,
      arg.data.startDate && sprint.startDate,
      arg.data.endDate && sprint.endDate
    );

    thunkAPI.dispatch(
      dispatchOperationCompleted(opId, OperationType.UpdateSprint, arg.sprintId)
    );
  } catch (error) {
    thunkAPI.dispatch(
      dispatchOperationError(
        opId,
        OperationType.UpdateSprint,
        error,
        arg.sprintId
      )
    );
  }

  return wrapUpOpAction(thunkAPI, opId, arg);
});

export function completeUpdateSprint(
  thunkAPI: IStoreLikeObject,
  sprint: ISprint,
  startDate?: string,
  endDate?: string
) {
  thunkAPI.dispatch(
    SprintActions.updateSprint({
      id: sprint.customId,
      data: sprint,
    })
  );

  if (startDate) {
    thunkAPI.dispatch(
      BoardActions.update({
        id: sprint.boardId,
        data: {
          currentSprintId: sprint.customId,
        },
      })
    );
  } else if (endDate) {
    completeEndSprint(thunkAPI, sprint, endDate);
  }
}

function completeEndSprint(
  thunkAPI: IStoreLikeObject,
  sprint: ISprint,
  date: string
) {
  thunkAPI.dispatch(
    BoardActions.update({
      id: sprint.boardId,
      data: {
        currentSprintId: null,
      },
    })
  );

  const board = BoardSelectors.assertGetOne(
    thunkAPI.getState(),
    sprint.boardId
  );
  const statusList = board.boardStatuses || [];
  const taskCompleteStatus = statusList[statusList.length - 1];

  if (!taskCompleteStatus) {
    return;
  }

  const tasks = getSprintTasks(thunkAPI.getState(), sprint.customId);
  const incompleteTasks = tasks.filter((task) => {
    return (
      task.taskSprint &&
      task.taskSprint.sprintId === sprint.customId &&
      task.status !== taskCompleteStatus.customId
    );
  });

  if (incompleteTasks.length === 0) {
    return;
  }

  let nextSprint: ISprint;

  if (sprint.nextSprintId) {
    nextSprint = SprintSelectors.getSprint(
      thunkAPI.getState(),
      sprint.nextSprintId
    );
  }

  const user = SessionSelectors.assertGetUser(thunkAPI.getState());
  const incompleteTasksUpdates = incompleteTasks.map((task) => ({
    id: task.customId,
    data: {
      taskSprint: nextSprint
        ? {
            sprintId: nextSprint.customId,
            assignedAt: date,
            assignedBy: user.customId,
          }
        : null,
    },
  }));

  thunkAPI.dispatch(TaskActions.bulkUpdate(incompleteTasksUpdates));
}
