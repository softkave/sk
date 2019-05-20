import React from "react";
import { connect } from "react-redux";
import RootGroup from "../../components/group/RootGroup.jsx";
import { makeBlockHandlers } from "../../models/block/handlers";
import get from "lodash/get";

class RootGroupContainer extends React.Component {
  render() {
    return <RootGroup {...this.props} />;
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
)(RootGroupContainer);
