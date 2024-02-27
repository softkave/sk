import { appMessages } from "../../../models/messages";
import UserAPI from "../../../net/user/user";
import { makeAsyncOp02NoPersist } from "../utils";
import { completeUserLogin } from "./signupUser";

export const newAnonymousUserOpAction = makeAsyncOp02NoPersist(
  "op/session/newAnonymousUser",
  async (arg: undefined, thunkAPI) => {
    const result = await UserAPI.newAnonymousUser();
    if (result && result.errors) {
      throw result.errors;
    } else if (result && result.token && result.user) {
      completeUserLogin(
        thunkAPI,
        result,
        /** remember */ true,
        /** rememberOnlyIfTokenExists */ false,
        /** isAnonymousUserToken */ true
      );
    } else {
      throw new Error(appMessages.anErrorOccurred);
    }
  }
);
