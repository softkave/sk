import { connect } from "react-redux";
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
