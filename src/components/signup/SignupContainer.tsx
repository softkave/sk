import { connect } from "react-redux";
import { signupUserOperationID } from "../../redux/operations/operationIDs";
import { getFirstOperationWithID } from "../../redux/operations/selectors";
import signupUserOperation from "../../redux/operations/session/sigupUser";
import Signup, { ISignupFormData } from "./Signup";

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

function mergeProps(state, { dispatch }) {
  return {
    operation: getFirstOperationWithID(state, signupUserOperationID),
    async onSubmit(user: ISignupFormData) {
      return signupUserOperation(state, dispatch, user);
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Signup);
