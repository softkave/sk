import { connect } from "react-redux";
import { loginUserOperationID } from "../../redux/operations/operationIDs";
import { getFirstOperationWithID } from "../../redux/operations/selectors";
import loginUserOperation from "../../redux/operations/session/loginUser";
import Login, { ILoginFormData } from "./Login";

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

function mergeProps(state, { dispatch }) {
  return {
    operation: getFirstOperationWithID(state, loginUserOperationID),
    async onSubmit(user: ILoginFormData) {
      return loginUserOperation(state, dispatch, user);
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Login);
