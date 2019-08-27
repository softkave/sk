import randomColor from "randomcolor";

import { connect } from "react-redux";
import { IUser } from "../../../models/user/user";
import netInterface from "../../../net";
import { INetResult } from "../../../net/query";
import { loginUserRedux } from "../../../redux/session/actions";
import { addUserRedux } from "../../../redux/users/actions";
import { devLog } from "../../../utils/log";
import { getReduxConnectors } from "../../../utils/redux";
import { IPipeline, makePipeline } from "../../FormPipeline";
import Signup from "./Signup";

interface ISignupParams {
  name: string;
  email: string;
  password: string;
}

interface ISignupProcessedParams extends ISignupParams {
  color: string;
}

interface ISignupNetResult extends INetResult {
  user: IUser;
  token: string;
}

const methods: IPipeline<
  ISignupParams,
  ISignupProcessedParams,
  ISignupNetResult,
  ISignupNetResult
> = {
  process({ params: user }) {
    return {
      ...user,
      color: randomColor()
    };
  },

  async net({ params: user }) {
    return await netInterface("user.signup", { user });
  },

  handleError: { stripBaseNames: ["user"] },

  redux({ result, dispatch }) {
    if (result.user && result.token) {
      dispatch(addUserRedux(result.user));
      dispatch(loginUserRedux(result.token, result.user.customId));
    } else {
      devLog(__filename, result);
      throw [{ type: "error", message: new Error("An error occurred") }];
    }
  }
};

function mapStateToProps(state) {
  console.log("signup map state");
  return state;
}

function mapDispatchToProps(dispatch) {
  console.log("signup map dispatch");
  return { dispatch };
}

function mergeProps(state, { dispatch }) {
  console.log("merge props was called");
  return {
    onSubmit: makePipeline(methods, { state, dispatch })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Signup);
