import netInterface from "../../net";
import { connect } from "react-redux";
import ForgotPassword from "./ForgotPassword";

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: async data => {
      await netInterface("user.forgotPassword", data);
    }
  };
}

export default connect(
  null,
  mapDispatchToProps
)(ForgotPassword);
