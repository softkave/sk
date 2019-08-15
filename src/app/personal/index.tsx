import React from "react";
import { connect } from "react-redux";

import Board from "../../components/block/group/Board";
import { getBlockMethods, IBlockMethods } from "../../components/block/methods";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { getBlock } from "../../redux/blocks/selectors";
import { getSignedInUser } from "../../redux/session/selectors";

export interface IPersonalContainerProps {
  blockHandlers: IBlockMethods;
  user: IUser;
  rootBlock?: IBlock;
}

interface IPersonalContainerState {
  error?: Error;
  loading: boolean;
}

class Personal extends React.Component<
  IPersonalContainerProps,
  IPersonalContainerState
> {
  constructor(props) {
    super(props);
    this.state = {
      error: undefined,
      loading: false
    };
  }

  public async componentDidMount() {
    if (!this.props.rootBlock) {
      try {
        this.setState({ loading: true });
        await this.props.blockHandlers.fetchRootData();
      } catch (error) {
        this.setState({ error, loading: false });
      }
    }
  }

  public render() {
    const { rootBlock, blockHandlers, user } = this.props;
    const { error, loading } = this.state;

    if (loading) {
      return "Loading";
    } else if (error) {
      return "An error occurred";
    }

    return (
      <Board
        isUserRootBlock
        block={rootBlock!}
        blockHandlers={blockHandlers}
        user={user}
        onBack={() => null}
        collaborators={[user]}
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
  const user = getSignedInUser(state);
  const blockHandlers = getBlockMethods({
    state,
    dispatch,
    user
  });

  const rootBlock = getBlock(state, user!.rootBlockId!);

  return {
    blockHandlers,
    rootBlock,
    user
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Personal);
