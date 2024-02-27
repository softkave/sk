import { ISprint } from "../../../models/sprint/types";
import SprintAPI from "../../../net/sprint/sprint";
import SprintActions from "../../sprints/actions";
import { makeAsyncOp02 } from "../utils";

export const getSprintsOpAction = makeAsyncOp02(
  "op/sprint/getSprints",
  async (arg: { boardId: string }, thunkAPI, extras) => {
    const isDemoMode = extras.isDemoMode;
    let sprints: ISprint[] = [];
    if (!isDemoMode) {
      const result = await SprintAPI.getSprints(arg.boardId);
      if (result && result.errors) {
        throw result.errors;
      }

      sprints = result.sprints || [];
    }

    thunkAPI.dispatch(SprintActions.bulkAddSprints(sprints));
  }
);
