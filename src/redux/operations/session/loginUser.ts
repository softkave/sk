import UserAPI from "../../../net/user/user";
import { assertEndpointResult } from "../../../net/utils";
import { makeAsyncOp02NoPersist } from "../utils";
import { completeUserLogin } from "./signupUser";

export interface ILoginUserOperationActionArgs {
  email: string;
  password: string;
  remember: boolean;
}

export const loginUserOpAction = makeAsyncOp02NoPersist(
  "op/session/loginUser",
  async (arg: ILoginUserOperationActionArgs, thunkAPI) => {
    const result = await UserAPI.login({
      email: arg.email,
      password: arg.password,
    });

    assertEndpointResult(result);
    if (result && result.token && result.user) {
      completeUserLogin(thunkAPI, result, arg.remember);
    } else {
      throw new Error("An error occurred");
    }
  }
);
