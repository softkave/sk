import { connect } from "react-redux";

import { AnyFunction } from "./types";

export function getReduxConnectors(mergePropsFunction: AnyFunction) {
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
