import { appMessages } from "../../../models/messages";
import UserAPI from "../../../net/user/user";
import { makeAsyncOp02NoPersist } from "../utils";
import { completeUserLogin } from "./signupUser";

export interface IChangePasswordWithForgotTokenOpActionParams {
  password: string;
  token: string;
  remember: boolean;
}

export const changePasswordWithForgotTokenOpAction = makeAsyncOp02NoPersist(
  "op/session/changePasswordWithForgotToken",
  async (arg: IChangePasswordWithForgotTokenOpActionParams, thunkAPI, extras) => {
    const result = await UserAPI.changePasswordWithToken({
      password: arg.password,
      token: arg.token,
    });

    if (result && result.errors) {
      throw result.errors;
    } else if (result && result.token && result.user) {
      completeUserLogin(thunkAPI, result, arg.remember, true);
    } else {
      throw new Error(appMessages.anErrorOccurred);
    }
  }
);
