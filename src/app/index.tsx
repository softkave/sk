import { connect } from "react-redux";

import netInterface from "../net";

import { getSignedInUser } from "../redux/session/selectors";
import { clearState } from "../redux/state/actions";
import { IReduxState } from "../redux/store";
import App from "./App";

function mapStateToProps(state: IReduxState, props) {
  const user = getSignedInUser(state);

  return {
    ...props,
    user,
    loginValid: !!user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onLogout() {
      dispatch(clearState());
      netInterface("user.logout");
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
