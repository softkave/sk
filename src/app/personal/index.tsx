import React from "react";
import { connect } from "react-redux";

import BoardContainer from "../../components/block/group/BoardContainer";
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
    if (!this.props.rootBlock && !this.props.user.loadingRootData) {
      try {
        this.setState({ loading: true });
        await this.props.blockHandlers.fetchRootData();
        this.setState({ loading: false, error: undefined });
      } catch (error) {
        this.setState({ error, loading: false });
      }
    }
  }

  public render() {
    const { rootBlock } = this.props;
    const { error, loading } = this.state;

    if (loading) {
      return "Loading";
    } else if (error) {
      return "An error occurred";
    }

    return (
      <BoardContainer
        isFromRoot
        isUserRootBlock
        blockID={rootBlock!.customId}
        block={rootBlock!}
        onBack={() => null}
      />
    );
  }
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

function mergeProps(state, { dispatch }) {
  const user = getSignedInUser(state);
  const blockHandlers = getBlockMethods({
    state,
    dispatch
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
