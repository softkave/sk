import netInterface from "../../net";
import { mergeDataByPath } from "../../redux/actions/data";
import { connect } from "react-redux";
import Signup from "./Signup";

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: async data => {
      let result = await netInterface("user.signup", data);

      if (result.user && result.token) {
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
)(Signup);
