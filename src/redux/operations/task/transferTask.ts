import assert from "assert";
import { messages } from "../../../models/messages";
import TaskAPI, {
  ITransferTaskEndpointParams,
} from "../../../net/task/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString } from "../../../utils/utils";
import TaskActions from "../../tasks/actions";
import TaskSelectors from "../../tasks/selectors";
import SessionSelectors from "../../session/selectors";
import OperationType from "../OperationType";
import { makeAsyncOp } from "../utils";
import BoardSelectors from "../../boards/selectors";
import { last } from "lodash";

// TODO: transferred tasks should retain their options like status and label
// if equivalents exist in the destination

export const transferTaskOpAction = makeAsyncOp(
  "op/tasks/transferTask",
  OperationType.TransferTask,
  async (arg: ITransferTaskEndpointParams, thunkAPI, extras) => {
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());
    let task = TaskSelectors.assertGetOne(thunkAPI.getState(), arg.taskId);

    if (extras.isDemoMode) {
      const board = BoardSelectors.getOne(thunkAPI.getState(), arg.boardId);
      const status0 = board && last(board.boardStatuses);
      task = {
        ...task,
        updatedBy: user.customId,
        updatedAt: getDateString(),
        parent: arg.boardId,
        status: status0?.customId,
        statusAssignedBy: user.customId,
        statusAssignedAt: getDateString(),
        labels: [],
        taskSprint: undefined,
      };
    } else {
      const result = await TaskAPI.transferTask(arg);
      assertEndpointResult(result);
      task = result.task;
    }

    assert(task, messages.internalError);
    thunkAPI.dispatch(
      TaskActions.update({
        id: task.customId,
        data: task,
        meta: { arrayUpdateStrategy: "replace" },
      })
    );
  }
);
