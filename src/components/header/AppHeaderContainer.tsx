import { connect } from "react-redux";
import { Dispatch } from "redux";
import logoutUserOperation from "../../redux/operations/session/logoutUser";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import { replaceView } from "../../redux/view/actions";
import { getRootView } from "../../redux/view/selectors";
import AppHeader from "./AppHeader";

function mapStateToProps(state: IReduxState) {
  return state;
}

function mapDispatchToProps(dispatch: Dispatch) {
  return { dispatch };
}

function mergeProps(state, { dispatch }) {
  const user = getSignedInUserRequired(state);
  const view = getRootView(state);

  return {
    user,
    currentViewName: view.viewName,
    onLogout() {
      logoutUserOperation(state, dispatch);
    },
    onChangeView(currentViewName: string, newViewName: string) {
      dispatch(replaceView(currentViewName, { viewName: newViewName }));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(AppHeader);
