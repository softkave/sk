import updateSocketEntryEvent from "../../../net/socket/outgoing/updateSocketEntryEvent";
import { makeAsyncOp02NoPersist } from "../utils";

export const updateSocketEntryOpAction = makeAsyncOp02NoPersist(
  "op/socket/updateSocketEntry",
  async (arg: { isActive: boolean }, thunkAPI, extras) => {
    if (!extras.isDemoMode) {
      updateSocketEntryEvent({ isActive: arg.isActive });
    }
  }
);
