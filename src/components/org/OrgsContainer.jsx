import React from "react";
import { connect } from "react-redux";
import { makeBlockHandlers } from "../block-utils";
import Orgs from "./Orgs.jsx";
import netInterface from "../../net";
import { mergeDataByPath } from "../../redux/actions/data";

class OrgsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: !props.orgs,
      error: null
    };
  }

  async componentDidMount() {
    if (this.state.loading) {
      try {
        await this.props.fetchOrgs();
      } catch (error) {
        this.setState({ error });
      }
    }
  }

  async fetchOrgs() {}

  render() {
    const { orgs, blockHandlers } = this.props;
    const { loading, error } = this.state;

    if (loading) {
      return "Loading";
    } else if (error) {
      return "An error occurred";
    }

    return <Orgs orgs={orgs} blockHandlers={blockHandlers} />;
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
    user: state.user.user
  });

  return {
    blockHandlers,
    orgs: state.orgs,
    async fetchOrgs() {
      let blocks = await netInterface("block.getPermissionBlocks");
      let rootBlock = null;
      let orgs = {};
      blocks.forEach(block => {
        if (block.type === "root") {
          block.path = "rootBlock";
          rootBlock = block;
        } else {
          block.path = `orgs.${block.id}`;
          orgs[block.id] = block;
        }
      });

      dispatch(mergeDataByPath("orgs", orgs));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(OrgsContainer);
