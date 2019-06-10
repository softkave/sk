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
      } else {
        throw new Error("an error occurred");
      }
    }
  };
}

export default connect(
  null,
  mapDispatchToProps
)(Login);
