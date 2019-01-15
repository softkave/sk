import React from "react";
import { connect } from "react-redux";
import { makeBlockHandlers, getBlockParent } from "../block-utils";
import { Col, Row } from "antd";
import get from "lodash/get";

class ProjectContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: !props.orgs,
      error: null
    };
  }

  componentDidMount() {
    if (this.state.loading) {
      this.fetchProjectData();
    }
  }

  async fetchProjectData() {}

  render() {
    const { loading, error } = this.state;

    if (loading) {
      return "Loading";
    } else if (error) {
      return "An error occurred";
    }

    return (
      <div>
        <Row />
        <Row />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { state };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

function mergeProps({ state }, { dispatch }, ownProps) {
  const blockHandlers = makeBlockHandlers({
    dispatch,
    user: state.user.user,
    parent: ownProps.project
  });

  return {
    blockHandlers,
    project: ownProps.project,
    fetchProjectData: null
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ProjectContainer);
