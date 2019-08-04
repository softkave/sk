import randomColor from "randomcolor";

import netInterface from "../../../net";
import { mergeDataByPath } from "../../../redux/actions/data";
import { devLog } from "../../../utils/log";
import { getReduxConnectors } from "../../../utils/redux";
import { stripFieldsFromError } from "../../FOR";
import { makePipeline } from "../../FormPipeline";
import Signup from "./Signup";

const methods = {
  process({ params: user }) {
    user.color = randomColor();
  },

  async net({ user }) {
    return await netInterface("user.signup", { user });
  },

  handleError(result) {
    if (result.errors) {
      result.errors = stripFieldsFromError(result.errors, ["user"]);
      throw result.errors;
    }

    return result;
  },

  redux({ result, dispatch }) {
    if (result.user && result.token) {
      dispatch(mergeDataByPath("user", result));
    } else {
      devLog(__filename, result);
      throw [{ type: "error", message: new Error("An error occurred") }];
    }
  }
};

function mergeProps({ state }, { dispatch }) {
  return {
    onSubmit: makePipeline(methods, { state, dispatch }, { paramName: "user" })
  };
}

export default getReduxConnectors(mergeProps)(Signup);
