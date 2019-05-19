import React from "react";
import { connect } from "react-redux";
import netInterface from "../net";
import { setDataByPath, deleteDataByPath } from "../redux/actions/data";
import { makeMultiple } from "../redux/actions/make";

class Operation extends React.Component {
  async componentDidUpdate() {
    const { nextOperation, done } = this.props;

    if (nextOperation) {
      try {
        const result = await netInterface(
          nextOperation.netPath,
          ...nextOperation.args
        );
        done(nextOperation, true, result);
      } catch (error) {
        done(nextOperation, false, error);
      }
    }
  }

  render() {
    return null;
  }
}

function mapStateToProps(state) {
  const operations = state.operations;
  let nextOperation = null;

  if (Array.isArray(operations) && operations.length > 0) {
    nextOperation = operations[0];
  }

  return {
    nextOperation
  };
}

function mapDispatchToProps(dispatch) {
  return {
    done(operation, success, result) {
      const actions = [];

      if (operation.deleteOperation) {
        actions.push(deleteDataByPath(operation.resourcePath));
      } else {
        actions.push(
          setDataByPath(operation.reduxPath, {
            ...operation,
            result,
            status: success ? "completed" : "failed"
          })
        );
      }

      dispatch(makeMultiple(actions));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Operation);
