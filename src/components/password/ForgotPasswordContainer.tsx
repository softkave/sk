import { connect } from "react-redux";
import { requestForgotPasswordOperationID } from "../../redux/operations/operationIDs";
import { getFirstOperationWithID } from "../../redux/operations/selectors";
import requestForgotPasswordOperationFunc from "../../redux/operations/session/requestForgotPassword";
import ForgotPassword, { IForgotPasswordFormData } from "./ForgotPassword";

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

function mergeProps(state, { dispatch }) {
  return {
    operation: getFirstOperationWithID(state, requestForgotPasswordOperationID),
    async onSubmit(data: IForgotPasswordFormData) {
      return requestForgotPasswordOperationFunc(state, dispatch, data);
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ForgotPassword);
