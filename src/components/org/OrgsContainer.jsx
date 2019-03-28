import React from "react";
import { connect } from "react-redux";
import { makeBlockHandlers } from "../../models/block/block-utils";
import Orgs from "./Orgs.jsx";
import netInterface from "../../net";
import { mergeDataByPath } from "../../redux/actions/data";

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
        await this.props.fetchOrgs();
      } catch (error) {
        this.setState({ error });
      }
    }
  }

  async fetchOrgs() {}

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

function mergeProps({ state }, { dispatch }, ownProps) {
  const blockHandlers = makeBlockHandlers({
    dispatch,
    user: state.user.user
  });

  return {
    blockHandlers,
    user: state.user.user,
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
