import { connect } from "react-redux";

import netInterface from "../../../net";
import { mergeDataByPath } from "../../../redux/actions/data";
import ChangePassword from "./ChangePassword";

const methods = {
  process(changePasswordData) {
    return changePasswordData;
  },

  async net(loginData) {
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

  redux(result, dispatch) {
    if (result.user && result.token) {
      dispatch(mergeDataByPath("user", result));
    } else if (result.errors) {
      throw new Error("An error occurred");
    }
  }
};

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: async data => {
      let changePasswordData = methods.process(data);
      let result = await methods.net(changePasswordData);
      result = methods.handleError(result);
      methods.redux(result, dispatch);
    }
  };
}

export default connect(
  null,
  mapDispatchToProps
)(ChangePassword);
