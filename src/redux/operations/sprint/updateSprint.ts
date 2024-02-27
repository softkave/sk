import { merge } from "lodash";
import { ISprint } from "../../../models/sprint/types";
import { ITask } from "../../../models/task/types";
import SprintAPI, { IUpdateSprintAPIParams } from "../../../net/sprint/sprint";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString } from "../../../utils/utils";
import BoardActions from "../../boards/actions";
import BoardSelectors from "../../boards/selectors";
import SessionSelectors from "../../session/selectors";
import SprintActions from "../../sprints/actions";
import SprintSelectors from "../../sprints/selectors";
import TaskActions from "../../tasks/actions";
import TaskSelectors from "../../tasks/selectors";
import { IStoreLikeObject } from "../../types";
import { IActionUpdate } from "../../utils";
import { makeAsyncOp02NoPersist, removeAsyncOp02Params } from "../utils";

export const updateSprintOpAction = makeAsyncOp02NoPersist(
  "op/sprint/updateSprint",
  async (arg: IUpdateSprintAPIParams, thunkAPI, extras) => {
    const isDemoMode = extras.isDemoMode;
    let sprint = SprintSelectors.getSprint(thunkAPI.getState(), arg.sprintId);
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());
    if (!isDemoMode) {
      const result = await SprintAPI.updateSprint({
        sprintId: arg.sprintId,
        data: removeAsyncOp02Params(arg.data),
      });

      assertEndpointResult(result);
      sprint = result.sprint;
    } else {
      sprint = merge(sprint, arg.data, {
        lastUpdatedAt: getDateString(),
        lastUpdatedBy: user.customId,
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
  }
);

export function completeUpdateSprint(
  thunkAPI: IStoreLikeObject,
  sprint: ISprint,
  startDate?: string,
  endDate?: string
) {
  thunkAPI.dispatch(SprintActions.updateSprint({ id: sprint.customId, data: sprint }));
  if (startDate) {
    thunkAPI.dispatch(
      BoardActions.update({
        id: sprint.boardId,
        data: { currentSprintId: sprint.customId },
        meta: { arrayUpdateStrategy: "replace" },
      })
    );
  } else if (endDate) {
    completeEndSprint(thunkAPI, sprint, endDate);
  }
}

function completeEndSprint(thunkAPI: IStoreLikeObject, sprint: ISprint, date: string) {
  thunkAPI.dispatch(
    BoardActions.update({
      id: sprint.boardId,
      data: { currentSprintId: null },
      meta: { arrayUpdateStrategy: "replace" },
    })
  );

  const board = BoardSelectors.assertGetOne(thunkAPI.getState(), sprint.boardId);
  const statusList = board.boardStatuses || [];
  const taskCompleteStatus = statusList[statusList.length - 1];
  if (!taskCompleteStatus) {
    return;
  }

  const tasks = TaskSelectors.getSprintTasks(thunkAPI.getState(), sprint.customId);
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
    nextSprint = SprintSelectors.getSprint(thunkAPI.getState(), sprint.nextSprintId);
  }

  const user = SessionSelectors.assertGetUser(thunkAPI.getState());
  const incompleteTasksUpdates = incompleteTasks.map(
    (task): IActionUpdate<ITask> => ({
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
      meta: { arrayUpdateStrategy: "replace" },
    })
  );

  thunkAPI.dispatch(TaskActions.bulkUpdate(incompleteTasksUpdates));
}
