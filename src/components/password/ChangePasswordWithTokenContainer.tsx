import { connect } from "react-redux";
import { dispatchOperationError } from "../../redux/operations/operation";
import { changePasswordOperationID } from "../../redux/operations/operationIDs";
import { getFirstOperationWithID } from "../../redux/operations/selectors";
import changePasswordOperation from "../../redux/operations/session/changePassword";
import OperationError, {
  defaultOperationError
} from "../../utils/operation-error/OperationError";
import ChangePassword, { IChangePasswordFormData } from "./ChangePassword";

// TODO: Implement an endpoint to get user email from token ( forgot password and session token )
// TODO: Implement a way to supply token to a net call
// TODO: Implement an endpoint to convert forgot password token to change password token ( maybe not necessary )

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

function mergeProps(state, { dispatch }) {
  return {
    operation: getFirstOperationWithID(state, changePasswordOperationID),
    async onSubmit(data: IChangePasswordFormData) {
      throw new Error("Implementation not complete");
      const query = new URLSearchParams(window.location.search);
      const token = query.get("t");

      return changePasswordOperation(state, dispatch, {
        password: data.password,
        email: "",
        token: token!
      });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ChangePassword);
