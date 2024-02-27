import BoardActions from "../../boards/actions";
import TaskSelectors from "../../tasks/selectors";
import { makeAsyncOp02 } from "../utils";

export const getAverageTimeToCompleteTasksOpAction = makeAsyncOp02(
  "op/block/getAverageTimeToCompleteTasks",
  async (args: { boardId: string }, thunkAPI, extras) => {
    let avg = 0;

    // TODO: this won't hold up once we implement task pagination
    const tasks = TaskSelectors.getBoardTasks(thunkAPI.getState(), args.boardId);
    if (tasks.length !== 0) {
      const count = tasks.length;
      const totalTime = tasks.reduce((total, item) => {
        if (!item.statusAssignedAt) {
          return total;
        }

        const createdAt = new Date(item.createdAt).valueOf();
        const statusAssignedAt = new Date(item.statusAssignedAt).valueOf();
        return total + (statusAssignedAt - createdAt);
      }, 0);

      avg = totalTime / count;
    }

    thunkAPI.dispatch(
      BoardActions.update({
        id: args.boardId,
        data: { avgTimeToCompleteTasks: avg },
        meta: { arrayUpdateStrategy: "replace" },
      })
    );
  }
);
