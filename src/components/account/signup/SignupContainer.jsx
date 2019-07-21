import { connect } from "react-redux";
import randomColor from "randomcolor";
import netInterface from "../../../net";
import { mergeDataByPath } from "../../../redux/actions/data";
import Signup from "./Signup";
import { stripFieldsFromError } from "../../FOR";

const methods = {
  process(user) {
    user.color = randomColor();
  },

  async net(user) {
    return await netInterface("user.signup", { user });
  },

  handleError(result) {
    if (result.errors) {
      result.errors = stripFieldsFromError(result.errors, ["user"]);
      throw result.errors;
    }

    return result;
  },

  redux(result, dispatch) {
    if (result.user && result.token) {
      dispatch(mergeDataByPath("user", result));
    } else {
      throw new Error("An error occurred");
    }
  }
};

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: async data => {
      let user = methods.process(data);
      let result = await methods.net(user);
      result = methods.handleError(result);
      methods.redux(result, dispatch);
    }
  };
}

export default connect(
  null,
  mapDispatchToProps
)(Signup);
