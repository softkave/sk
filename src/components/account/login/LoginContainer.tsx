import { IUser } from "../../../models/user/user";
import netInterface from "../../../net";
import { INetResult } from "../../../net/query";
import { mergeDataByPath } from "../../../redux/actions/data";
import { devLog } from "../../../utils/log";
import { getReduxConnectors } from "../../../utils/redux";
import { IPipeline, makePipeline } from "../../FormPipeline";
import Login from "./Login";

interface ILoginParams {
  email: string;
  password: string;
}

interface ILoginNetResult extends INetResult {
  user?: IUser;
  token?: string;
}

const methods: IPipeline<
  ILoginParams,
  ILoginParams,
  ILoginNetResult,
  ILoginNetResult
> = {
  async net({ params }) {
    return await netInterface("user.login", {
      email: params.email,
      password: params.password
    });
  },

  redux({ result, dispatch }) {
    if (result && result.user && result.token) {
      dispatch(mergeDataByPath("user", result));
    } else if (result.errors) {
      devLog(__filename, result);
      throw [{ type: "error", message: new Error("An error occurred") }];
    }
  }
};

function mergeProps({ state }, { dispatch }) {
  return {
    onSubmit: makePipeline(methods, { state, dispatch })
  };
}

export default getReduxConnectors(mergeProps)(Login);
