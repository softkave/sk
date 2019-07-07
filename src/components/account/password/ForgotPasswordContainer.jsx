import { connect } from "react-redux";
import netInterface from "../../../net";
import ForgotPassword from "./ForgotPassword";

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: async data => {
      const result = await netInterface("user.forgotPassword", data.email);

      if (result && result.errors) {
        throw result.errors;
      }
    }
  };
}

export default connect(
  null,
  mapDispatchToProps
)(ForgotPassword);
