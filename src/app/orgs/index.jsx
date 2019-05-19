import React from "react";
import { connect } from "react-redux";
import { makeBlockHandlers } from "../../models/block/handlers";
import Orgs from "../../components/org/Orgs.jsx";

class OrgsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }

  async componentDidMount() {
    if (!this.props.orgs) {
      try {
        await this.props.blockHandlers.fetchRootData();
      } catch (error) {
        this.setState({ error });
      }
    }
  }

  render() {
    const { orgs } = this.props;
    const { error } = this.state;

    if (!orgs) {
      return "Loading";
    } else if (error) {
      return "An error occurred";
    }

    return <Orgs {...this.props} />;
  }
}

function mapStateToProps(state) {
  return { state };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

function mergeProps({ state }, { dispatch }) {
  const blockHandlers = makeBlockHandlers({
    dispatch,
    user: state.user.user
  });

  return {
    blockHandlers,
    // rootBlock: state.rootBlock,
    user: state.user.user,
    orgs: state.orgs
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(OrgsContainer);
