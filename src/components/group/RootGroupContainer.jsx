import React from "react";
import { connect } from "react-redux";
import { sortBlocks } from "../../models/block/block-utils";
import { makeBlockHandlers } from "../../models/block/block-handlers";
import RootGroup from "./RootGroup.jsx";
import netInterface from "../../net";
import { makeMultiple } from "../../redux/actions/make";
import { mergeDataByPath } from "../../redux/actions/data";
import get from "lodash/get";

class RootGroupContainer extends React.Component {
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
    const { rootBlock, blockHandlers, assignedTasks, user } = this.props;
    const { error } = this.state;

    if (!rootBlock) {
      return "Loading";
    } else if (error) {
      return "An error occurred";
    }

    return (
      <RootGroup
        rootBlock={rootBlock}
        blockHandlers={blockHandlers}
        assignedTasks={assignedTasks}
        user={user}
      />
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
  const user = state.user.user;
  const blockHandlers = makeBlockHandlers({
    dispatch,
    user,
    parent: state.rootBlock
  });

  return {
    blockHandlers,
    user,
    rootBlock: state.rootBlock,
    assignedTasks: (function() {
      if (state.assignedTasks) {
        let tasks = {};
        Object.keys(state.assignedTasks).forEach(task => {
          if (typeof task === "string") {
            task = get(state, task);
          }

          tasks[task.id] = task;
        });

        return tasks;
      }
    })(),

    async fetchRootData() {
      const rootBlockId = user.permissions.find(
        permission => permission.type === "root"
      ).blockId;

      const blocks = await netInterface("block.getInitBlocks");
      let { assignedTasks, rootBlock, orgs } = sortBlocks({
        blocks,
        rootBlockId,
        standingOrgs: state.orgs
      });

      let actions = [
        mergeDataByPath(rootBlock.path, rootBlock),
        mergeDataByPath("assignedTasks", assignedTasks)
      ];

      if (!state.orgs) {
        actions.push(mergeDataByPath("orgs", orgs));
      }

      dispatch(makeMultiple(actions));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(RootGroupContainer);
