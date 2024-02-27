import { appMessages } from "../../../models/messages";
import UserAPI from "../../../net/user/user";
import { makeAsyncOp02NoPersist } from "../utils";
import { completeUserLogin } from "./signupUser";

export const changePasswordWithCurrentPasswordOpAction = makeAsyncOp02NoPersist(
  "op/session/changePasswordWithCurrentPassword",
  async (arg: { password: string; currentPassword: string }, thunkAPI, extras) => {
    if (!extras.isDemoMode && !extras.isAnonymousUser) {
      const result = await UserAPI.changePassword({
        password: arg.password,
        currentPassword: arg.currentPassword,
      });

      if (result && result.errors) {
        throw result.errors;
      } else if (result && result.token && result.user) {
        completeUserLogin(thunkAPI, result, false, true);
      } else {
        throw new Error(appMessages.anErrorOccurred);
      }
    }
  }
);
