import { connect } from "react-redux";
import { Dispatch } from "redux";

import { IReduxState } from "../../redux/store";
import { getBlockMethods } from "../block/methods";
import Group from "./Group";

function mapStateToProps(state: IReduxState) {
  return state;
}

function mapDispatchToProps(dispatch: Dispatch) {
  return { dispatch };
}

function mergeProps(state: IReduxState, { dispatch }: { dispatch: Dispatch }) {
  return {
    blockHandlers: getBlockMethods(state, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Group);
