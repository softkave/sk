import { connect } from "react-redux";
import netInterface from "../../../net";
import ForgotPassword from "./ForgotPassword";

const methods = {
  process(userInfo) {
    return userInfo;
  },

  async net(userInfo) {
    return await netInterface("user.forgotPassword", { email: userInfo.email });
  },

  handleError(result) {
    if (result.errors) {
      throw result.errors;
    }

    return result;
  },

  redux(result, dispatch) {}
};

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: async data => {
      let userInfo = methods.process(data);
      let result = await methods.net(userInfo);
      result = methods.handleError(result);
      methods.redux(result, dispatch);
    }
  };
}

export default connect(
  null,
  mapDispatchToProps
)(ForgotPassword);
