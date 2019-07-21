import React from "react";
import { connect } from "react-redux";
import Board from "../../components/block/group/Board";
import { makeBlockHandlers } from "../../models/block/handlers";

class Personal extends React.Component {
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
    const { rootBlock, blockHandlers, user } = this.props;
    const { error } = this.state;

    if (!rootBlock) {
      return "Loading";
    } else if (error) {
      return "An error occurred";
    }

    return (
      <Board
        isUserRootBlock
        rootBlock={rootBlock}
        blockHandlers={blockHandlers}
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
  // const blockHandlers = makeBlockHandlers({
  //   dispatch,
  //   user
  // });

  const blockHandlers = getBlockMethods({ state, dispatch, user });

  return {
    blockHandlers,
    user,
    rootBlock: state.rootBlock
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Personal);
