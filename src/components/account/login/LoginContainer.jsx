import { connect } from "react-redux";

import netInterface from "../../../net";
import { mergeDataByPath } from "../../../redux/actions/data";
import Login from "./Login";

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: async data => {
      let result = await netInterface("user.login", data);

      if (result && result.user && result.token) {
        dispatch(mergeDataByPath("user", result));
      } else if (result.errors) {
        throw result.errors;
      }
    }
  };
}

export default connect(
  null,
  mapDispatchToProps
)(Login);
