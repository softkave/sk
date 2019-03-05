import React from "react";
import { connect } from "react-redux";
import dotProp from "dot-prop-immutable";
import RootGroup from "./RootGroup.jsx";

function mapStateToProps(state, props) {
  return {
    ...props,
    rootBlock: dotProp.get(state, props.path) || props.rootBlock
  };
}

function G(props) {
  return <RootGroup {...props} />;
}

export default connect(mapStateToProps)(G);
