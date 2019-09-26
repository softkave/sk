import { connect } from "react-redux";
import { Dispatch } from "redux";

import { logoutUserRedux } from "../../redux/session/actions";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import { replaceView } from "../../redux/view/actions";
import { getRootView } from "../../redux/view/selectors";
import AppHeader from "./AppHeader";

function mapStateToProps(state: IReduxState) {
  const user = getSignedInUserRequired(state);
  const view = getRootView(state);

  return {
    user,
    currentViewName: view.viewName
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onLogout() {
      dispatch(logoutUserRedux());
    },
    onChangeView(currentViewName: string, newViewName: string) {
      dispatch(replaceView(currentViewName, newViewName));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppHeader);
