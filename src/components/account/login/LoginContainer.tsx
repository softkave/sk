import { connect } from "react-redux";
import { IUser } from "../../../models/user/user";
import netInterface from "../../../net";
import { INetResult } from "../../../net/query";
import { loginUserRedux } from "../../../redux/session/actions";
import { addUserRedux } from "../../../redux/users/actions";
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
      dispatch(addUserRedux(result.user));
      dispatch(loginUserRedux(result.token, result.user.customId));
    } else if (result.errors) {
      devLog(__filename, result);
      throw [{ type: "error", message: new Error("An error occurred") }];
    }
  }
};

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

function mergeProps(state, { dispatch }) {
  return {
    onSubmit: makePipeline(methods, { state, dispatch })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Login);
