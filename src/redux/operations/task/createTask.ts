import assert from "assert";
import { defaultTo } from "lodash";
import { appMessages } from "../../../models/messages";
import { ITask, ITaskFormValues } from "../../../models/task/types";
import { getNewTaskInput } from "../../../models/task/utils";
import TaskAPI, { ICreateTaskEndpointParams } from "../../../net/task/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import { getNewId } from "../../../utils/ids";
import { getDateString } from "../../../utils/utils";
import SessionSelectors from "../../session/selectors";
import TaskActions from "../../tasks/actions";
import { IStoreLikeObject } from "../../types";
import { makeAsyncOp02NoPersist } from "../utils";

export const createTaskOpAction = makeAsyncOp02NoPersist(
  "op/tasks/createTask",
  async (
    arg: Omit<ICreateTaskEndpointParams, "task"> & {
      task: Partial<ITaskFormValues>;
    },
    thunkAPI,
    extras
  ) => {
    let task: ITask | null = null;
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());
    const createTaskInput = getNewTaskInput(arg.task);
    if (extras.isDemoMode) {
      task = {
        customId: getNewId(),
        createdBy: user.customId,
        createdAt: getDateString(),
        workspaceId: createTaskInput.workspaceId,
        name: createTaskInput.name,
        description: createTaskInput.description,
        boardId: createTaskInput.boardId,
        dueAt: createTaskInput.dueAt,
        status: createTaskInput.status ?? undefined,
        taskResolution: createTaskInput.taskResolution ?? undefined,
        priority: createTaskInput.priority,
        taskSprint: createTaskInput.taskSprint && {
          ...createTaskInput.taskSprint,
          assignedAt: getDateString(),
          assignedBy: user.customId,
        },
        assignees: defaultTo(createTaskInput.assignees, []).map((item) => ({
          ...item,
          assignedAt: getDateString(),
          assignedBy: user.customId,
        })),
        subTasks: defaultTo(createTaskInput.subTasks, []).map((item) => ({
          ...item,
          createdAt: getDateString(),
          createdBy: user.customId,
          completedBy: item.completedBy ?? undefined,
        })),
        labels: defaultTo(createTaskInput.labels, []).map((item) => ({
          ...item,
          assignedAt: getDateString(),
          assignedBy: user.customId,
        })),
        visibility: "organization",
      };
    } else {
      const result = await TaskAPI.createTask({ task: createTaskInput });
      assertEndpointResult(result);
      task = result.task;
    }

    assert(task, appMessages.internalError);
    completeCreateTask(thunkAPI, task);
    return task;
  }
);

export function completeCreateTask(thunkAPI: IStoreLikeObject, task: ITask) {
  thunkAPI.dispatch(
    TaskActions.update({ id: task.customId, data: task, meta: { arrayUpdateStrategy: "replace" } })
  );
}
