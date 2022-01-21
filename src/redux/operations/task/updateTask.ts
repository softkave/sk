import assert from "assert";
import { defaultTo } from "lodash";
import { messages } from "../../../models/messages";
import TaskAPI, {
    IUpdateTaskEndpointParams,
} from "../../../net/task/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString, processComplexTypeInput } from "../../../utils/utils";
import TaskActions from "../../tasks/actions";
import TaskSelectors from "../../tasks/selectors";
import SessionSelectors from "../../session/selectors";
import OperationType from "../OperationType";
import { makeAsyncOp } from "../utils";

export const updateTaskOpAction = makeAsyncOp(
    "op/tasks/updateTask",
    OperationType.UpdateTask,
    async (arg: IUpdateTaskEndpointParams, thunkAPI, extras) => {
        const user = SessionSelectors.assertGetUser(thunkAPI.getState());
        let task = TaskSelectors.assertGetOne(thunkAPI.getState(), arg.taskId);

        if (extras.isDemoMode) {
            task = {
                ...task,
                updatedBy: user.customId,
                updatedAt: getDateString(),
                name: defaultTo(arg.data.name, task.name),
                description: defaultTo(arg.data.description, task.description),
                priority: defaultTo(arg.data.priority, task.priority),
                parent: defaultTo(arg.data.parent, task.parent),
                dueAt: defaultTo(arg.data.dueAt, task.dueAt),
                status: defaultTo(arg.data.status, task.status),
                taskResolution: defaultTo(
                    arg.data.taskResolution,
                    task.taskResolution
                ),

                assignees: arg.data.assignees
                    ? processComplexTypeInput(
                          task.assignees,
                          arg.data.assignees,
                          "userId",
                          (item) => ({
                              ...item,
                              assignedAt: getDateString(),
                              assignedBy: user.customId,
                          })
                      )
                    : task.assignees,

                labels: arg.data.labels
                    ? processComplexTypeInput(
                          task.labels,
                          arg.data.labels,
                          "customId",
                          (item) => ({
                              ...item,
                              assignedAt: getDateString(),
                              assignedBy: user.customId,
                          })
                      )
                    : task.labels,

                subTasks: arg.data.subTasks
                    ? processComplexTypeInput(
                          task.subTasks,
                          arg.data.subTasks,
                          "customId",
                          (item) => ({
                              ...item,
                              createdAt: getDateString(),
                              createdBy: user.customId,
                          })
                      )
                    : task.subTasks,

                taskSprint: arg.data.taskSprint
                    ? {
                          ...arg.data.taskSprint,
                          assignedAt: getDateString(),
                          assignedBy: user.customId,
                      }
                    : task.taskSprint,
            };
        } else {
            const result = await TaskAPI.updateTask(arg);
            assertEndpointResult(result);
            task = result.task;
        }

        assert(task, messages.internalError);
        thunkAPI.dispatch(
            TaskActions.update({
                id: task.customId,
                data: task,
            })
        );
    }
);
