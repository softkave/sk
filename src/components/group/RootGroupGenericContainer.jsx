import { connect } from "react-redux";
import RootGroup from "./RootGroup.jsx";
import dotProp from "dot-prop-immutable";

function mapStateToProps(state, props) {
  return {
    ...props,
    rootBlock: dotProp.get(props.path) || props.rootBlock
  };
}

export default connect(mapStateToProps)(RootGroup);
