import { connect } from "react-redux";
import requestForgotPasswordOperation, {
  IForgotPasswordData
} from "../../redux/operations/session/requestForgotPassword";
import ForgotPassword from "./ForgotPassword";

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

function mergeProps(state, { dispatch }) {
  return {
    async onSubmit(data: IForgotPasswordData) {
      return requestForgotPasswordOperation(state, dispatch, data);
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ForgotPassword);
