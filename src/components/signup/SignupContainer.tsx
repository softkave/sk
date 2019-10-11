import { connect } from "react-redux";
import { signupUserOperationID } from "../../redux/operations/operationIDs";
import { getFirstOperationWithID } from "../../redux/operations/selectors";
import signupUserOperation, {
  ISignupUserData
} from "../../redux/operations/session/sigupUser";
import Signup from "./Signup";

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

function mergeProps(state, { dispatch }) {
  return {
    operation: getFirstOperationWithID(state, signupUserOperationID),
    async onSubmit(user: ISignupUserData) {
      return signupUserOperation(state, dispatch, user);
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Signup);
