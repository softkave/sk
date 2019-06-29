import { connect } from "react-redux";
import randomColor from "randomcolor";
import netInterface from "../../../net";
import { mergeDataByPath } from "../../../redux/actions/data";
import Signup from "./Signup";

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: async data => {
      data.color = randomColor();
      let result = await netInterface("user.signup", data);

      if (result.errors) {
        throw result.errors;
      }

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
