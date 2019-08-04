import netInterface from "../../../net";
import { getReduxConnectors } from "../../../utils/redux";
import { makePipeline } from "../../FormPipeline";
import ForgotPassword from "./ForgotPassword";

const methods = {
  async net({ userInfo }) {
    return await netInterface("user.forgotPassword", { email: userInfo.email });
  },

  handleError(result) {
    if (result.errors) {
      throw result.errors;
    }

    return result;
  }
};

function mergeProps({ state }, { dispatch }) {
  return {
    onSubmit: makePipeline(
      methods,
      { state, dispatch },
      { paramName: "userInfo" }
    )
  };
}

export default getReduxConnectors(mergeProps)(ForgotPassword);
