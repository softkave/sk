import React from "react";
import { connect } from "react-redux";
import { sortBlocks } from "../../models/block/block-utils";
import Org from "./Org.jsx";
import netInterface from "../../net";
import { mergeDataByPath } from "../../redux/actions/data";
import { makeBlockHandlers } from "../../models/block/block-handlers";

class OrgContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: !props.org.loadedData,
      error: null
    };
  }

  async componentDidMount() {
    if (this.state.loading) {
      try {
        await this.props.fetchOrgData();
      } catch (error) {
        this.setState({ error });
      }
    }
  }

  render() {
    const { org, blockHandlers } = this.props;
    const { loading, error } = this.state;

    if (loading) {
      return "Loading";
    } else if (error) {
      return "An error occurred";
    }

    return <Org org={org} blockHandlers={blockHandlers} />;
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
    parent: ownProps.org
  });

  return {
    blockHandlers,
    org: ownProps.org,
    async fetchOrgData() {
      let org = ownProps.orgs;
      let blocks = await netInterface("block.getBlockChildren", {
        block: ownProps.org,
        types: ["task", "group", "project"]
      });

      blocks.push({ ...org });
      let { orgs } = sortBlocks({
        blocks,
        replaceWithPath: state.assignedTasks
      });

      org = orgs[org.id];
      dispatch(mergeDataByPath(org.path, org));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(OrgContainer);
