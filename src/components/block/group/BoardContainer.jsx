import React from "react";
import { connect } from "react-redux";
import get from "lodash/get";
import Board from "./Board";
import { makeBlockHandlers } from "../../../models/block/handlers";

class BoardContainer extends React.Component {
  render() {
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
  const blockHandlers = makeBlockHandlers({
    dispatch,
    user
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
