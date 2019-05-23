import netInterface from "../../net";
import { mergeDataByPath } from "../../redux/actions/data";
import { connect } from "react-redux";
import ChangePassword from "./ChangePassword";

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: async data => {
      const q = new URLSearchParams(window.location.search);
      let result = await netInterface(
        "user.changePasswordWithToken",
        data.password,
        q.get("t")
      );

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
)(ChangePassword);
