import { connect } from "react-redux";
import randomColor from "randomcolor";
import netInterface from "../../../net";
import { mergeDataByPath } from "../../../redux/actions/data";
import Signup from "./Signup";

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: async data => {
      let result = await netInterface("user.signup", data);

      if (result.user && result.token) {
        result.user.color = randomColor();
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
