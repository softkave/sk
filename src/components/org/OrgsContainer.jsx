import React from "react";
import { connect } from "react-redux";
import { makeBlockHandlers } from "../../models/block/block-handlers";
import Orgs from "./Orgs.jsx";
import netInterface from "../../net";
import { mergeDataByPath } from "../../redux/actions/data";
import { makeMultiple } from "../../redux/actions/make";

class OrgsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }

  async componentDidMount() {
    if (!this.props.rootBlock) {
      try {
        await this.props.fetchRootData();
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
    rootBlock: state.rootBlock,
    user: state.user.user,
    orgs: state.orgs,
    async fetchRootData() {
      const { blocks } = await netInterface("block.getRoleBlocks");

      let rootBlock = null;
      let orgs = {};
      blocks.forEach(blk => {
        if (blk.type === "root") {
          rootBlock = blk;
          rootBlock.path = `rootBlock`;
        } else if (blk.type === "org") {
          orgs[blk.customId] = blk;
          blk.path = `orgs.${blk.customId}`;
        }
      });

      let actions = [
        mergeDataByPath(rootBlock.path, rootBlock),
        mergeDataByPath("orgs", orgs)
      ];

      dispatch(makeMultiple(actions));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(OrgsContainer);
