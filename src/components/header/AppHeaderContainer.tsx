import { connect } from "react-redux";
import { Dispatch } from "redux";
import logoutUserOperationFunc from "../../redux/operations/session/logoutUser";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import { setRootView } from "../../redux/view/actions";
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
      logoutUserOperationFunc(state, dispatch);
    },
    onChangeView(newViewName: string) {
      dispatch(setRootView({ viewName: newViewName }));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(AppHeader);
