import { connect } from "react-redux";

import netInterface from "../../../net";
import { mergeDataByPath } from "../../../redux/actions/data";
import Login from "./Login";

const methods = {
  process(loginData) {
    return loginData;
  },

  async net(loginData) {
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

  redux(result, dispatch) {
    if (result && result.user && result.token) {
      dispatch(mergeDataByPath("user", result));
    } else if (result.errors) {
      throw new Error("An error occurred");
    }
  }
};

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: async data => {
      let loginData = methods.process(data);
      let result = await methods.net(loginData);
      result = methods.handleError(result);
      methods.redux(result, dispatch);
    }
  };
}

export default connect(
  null,
  mapDispatchToProps
)(Login);
