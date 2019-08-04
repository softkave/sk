import netInterface from "../../../net";
import { mergeDataByPath } from "../../../redux/actions/data";
import { getReduxConnectors } from "../../../utils/redux";
import { makePipeline } from "../../FormPipeline";
import Login from "./Login";
import { devLog } from "../../../utils/log";

const methods = {
  async net({ loginData }) {
    return await netInterface("user.login", {
      email: loginData.email,
      password: loginData.password
    });
  },

  handleError(result) {
    if (result.errors) {
      throw result.errors;
    }

    return result;
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
    onSubmit: makePipeline(
      methods,
      { state, dispatch },
      { paramName: "loginData" }
    )
  };
}

export default getReduxConnectors(mergeProps)(Login);
