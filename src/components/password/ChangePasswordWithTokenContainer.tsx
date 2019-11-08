import { connect } from "react-redux";
import { changePasswordOperationID } from "../../redux/operations/operationIDs";
import { getFirstOperationWithID } from "../../redux/operations/selectors";
import changePasswordOperationFunc from "../../redux/operations/session/changePassword";
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
      const query = new URLSearchParams(window.location.search);
      const token = query.get("t");

      return changePasswordOperationFunc(state, dispatch, {
        password: data.password,

        // TODO: Fetch email using the token
        // email: "",
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
