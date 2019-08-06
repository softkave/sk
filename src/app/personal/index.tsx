import React from "react";
import { connect } from "react-redux";

import Board from "../../components/block/group/Board";
import { getBlockMethods, IBlockMethods } from "../../components/block/methods";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";

export interface IPersonalContainerProps {
  blockHandlers: IBlockMethods;
  user: IUser;
  rootBlock?: IBlock;
}

interface IPersonalContainerState {
  error?: Error;
}

class Personal extends React.Component<
  IPersonalContainerProps,
  IPersonalContainerState
> {
  constructor(props) {
    super(props);
    this.state = {
      error: undefined
    };
  }

  public async componentDidMount() {
    if (!this.props.rootBlock) {
      try {
        await this.props.blockHandlers.fetchRootData();
      } catch (error) {
        this.setState({ error });
      }
    }
  }

  public render() {
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
