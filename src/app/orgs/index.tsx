import React from "react";
import { connect } from "react-redux";

import { Dispatch } from "redux";
import { getBlockMethods, IBlockMethods } from "../../components/block/methods";
import Orgs from "../../components/block/org/Orgs";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { getBlocksAsArray } from "../../redux/blocks/selectors";
import { getSignedInUser } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";

export interface IOrgsContainerProps {
  blockHandlers: IBlockMethods;
  user: IUser;
  areOrgsLoaded: boolean;
  orgs?: IBlock[];
}

interface IOrgsContainerState {
  error?: Error;
  loading: boolean;
}

class OrgsContainer extends React.Component<
  IOrgsContainerProps,
  IOrgsContainerState
> {
  constructor(props) {
    super(props);
    this.state = {
      error: undefined,
      loading: false
    };
  }

  public async componentDidMount() {
    if (!this.props.areOrgsLoaded) {
      try {
        this.setState({ loading: true });
        await this.props.blockHandlers.fetchRootData();
      } catch (error) {
        this.setState({ error, loading: false });
      }
    }
  }

  public render() {
    const { orgs, blockHandlers, user } = this.props;
    const { error, loading } = this.state;

    if (loading) {
      return "Loading";
    } else if (error) {
      return "An error occurred";
    }

    return <Orgs orgs={orgs!} blockHandlers={blockHandlers} user={user} />;
  }
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return dispatch;
}

function mergeProps(state: IReduxState, dispatch: Dispatch) {
  const user = getSignedInUser(state);

  const blockHandlers = getBlockMethods({
    state,
    dispatch,
    user
  });

  const orgs = getBlocksAsArray(state, user!.orgs!);
  const areOrgsLoaded = orgs.length !== user!.orgs!.length;

  return {
    blockHandlers,
    areOrgsLoaded,
    user,
    orgs
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(OrgsContainer);
