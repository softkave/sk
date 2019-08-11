import get from "lodash/get";
import React from "react";
import { connect } from "react-redux";

import { getBlockMethods } from "../methods";
import Board, { IBoardProps } from "./Board";

export interface IBoardContainerProps extends IBoardProps {
  blockID: string;
}

class BoardContainer extends React.Component<IBoardContainerProps> {
  public render() {
    return <Board {...this.props} />;
  }
}

function mapStateToProps(state) {
  return { state };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

function mergeProps({ state }, { dispatch }, ownProps) {
  const user = state.user.user;
  const rootBlock = get(state, ownProps.path);
  const blockHandlers = getBlockMethods({
    dispatch,
    state
  });

  return {
    ...ownProps,
    blockHandlers,
    user,
    rootBlock
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(BoardContainer);
