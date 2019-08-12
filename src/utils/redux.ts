import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IReduxState } from "../redux/store";

export type ReduxConnectorMergePropsFunction = (
  state: IReduxState,
  dispatch: Dispatch,
  ...args
) => any;

export function getReduxConnectors(
  mergePropsFunction: ReduxConnectorMergePropsFunction
) {
  function mapStateToProps(state) {
    return state;
  }

  function mapDispatchToProps(dispatch) {
    return dispatch;
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps,
    mergePropsFunction
  );
}
