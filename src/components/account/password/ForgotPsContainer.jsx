import { connect } from "react-redux";
import netInterface from "../../../net";
import ForgotPassword from "./ForgotPassword";

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: async data => {
      await netInterface("user.forgotPassword", data.email);
    }
  };
}

export default connect(
  null,
  mapDispatchToProps
)(ForgotPassword);
