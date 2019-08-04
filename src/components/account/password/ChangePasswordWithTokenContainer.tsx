import netInterface from "../../../net";
import { mergeDataByPath } from "../../../redux/actions/data";
import { devLog } from "../../../utils/log";
import { getReduxConnectors } from "../../../utils/redux";
import { makePipeline } from "../../FormPipeline";
import ChangePassword from "./ChangePassword";

const methods = {
  async net({ data }) {
    const query = new URLSearchParams(window.location.search);

    return await netInterface("user.changePasswordWithToken", {
      password: data.password,
      token: query.get("t")
    });
  },

  handleError(result) {
    if (result.errors) {
      throw result.errors;
    }

    return result;
  },

  redux({ result, dispatch }) {
    if (result.user && result.token) {
      dispatch(mergeDataByPath("user", result));
    } else if (result.errors) {
      devLog(__filename, result);
      throw [{ type: "error", message: new Error("An error occurred") }];
    }
  }
};

function mergeProps({ state }, { dispatch }) {
  return {
    onSubmit: makePipeline(methods, { state, dispatch }, { paramName: "data" })
  };
}

export default getReduxConnectors(mergeProps)(ChangePassword);
