import { connect } from "react-redux";

import netInterface from "../net";
import { clearState } from "../redux/actions/data";
import App from "./App";

function mapStateToProps(state, props) {
  const user = state.user && state.user.token ? state.user : {};
  return {
    ...props,
    user: user.user,
    loginValid: !!user.token
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
