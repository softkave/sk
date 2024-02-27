import UserAPI from "../../../net/user/user";
import { assertEndpointResult } from "../../../net/utils";
import { makeAsyncOp02NoPersist } from "../utils";

export interface IRequestForgotPasswordOperationActionArgs {
  email: string;
}

export const requestForgotPasswordOpAction = makeAsyncOp02NoPersist(
  "op/session/requestForgotPassword",
  async (arg: { email: string }, thunkAPI) => {
    const result = await UserAPI.forgotPassword({ email: arg.email });
    assertEndpointResult(result);
  }
);
