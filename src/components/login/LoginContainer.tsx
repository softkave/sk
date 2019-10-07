import { connect } from "react-redux";
import loginUserOperation, {
  ILoginUserData
} from "../../redux/operations/session/loginUser";
import Login from "./Login";

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

function mergeProps(state, { dispatch }) {
  return {
    async onSubmit(user: ILoginUserData) {
      return loginUserOperation(state, dispatch, user);
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Login);
