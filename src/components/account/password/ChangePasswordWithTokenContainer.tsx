import { IUser } from "../../../models/user/user";
import netInterface from "../../../net";
import { INetResult } from "../../../net/query";
import { loginUserRedux } from "../../../redux/session/actions";
import { addUserRedux } from "../../../redux/users/actions";
import { devLog } from "../../../utils/log";
import { getReduxConnectors } from "../../../utils/redux";
import { IPipeline, makePipeline } from "../../FormPipeline";
import ChangePassword from "./ChangePassword";

interface IChangePasswordWithTokenParams {
  password: string;
  token: string;
}

interface IChangePasswordWithTokenNetResult extends INetResult {
  user?: IUser;
  token?: string;
}

const methods: IPipeline<
  IChangePasswordWithTokenParams,
  IChangePasswordWithTokenParams,
  IChangePasswordWithTokenNetResult,
  IChangePasswordWithTokenNetResult
> = {
  async net({ params }) {
    const query = new URLSearchParams(window.location.search);

    return await netInterface("user.changePasswordWithToken", {
      password: params.password,
      token: query.get("t")
    });
  },

  redux({ result, dispatch }) {
    if (result.user && result.token) {
      dispatch(addUserRedux(result.user));
      dispatch(loginUserRedux(result.token, result.user.customId));
    } else if (result.errors) {
      devLog(__filename, result);
      throw [{ type: "error", message: new Error("An error occurred") }];
    }
  }
};

function mergeProps(state, dispatch) {
  return {
    onSubmit: makePipeline(methods, { state, dispatch })
  };
}

export default getReduxConnectors(mergeProps)(ChangePassword);
