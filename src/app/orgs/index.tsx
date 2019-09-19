import React from "react";
import { connect } from "react-redux";

import { Dispatch } from "redux";
import { getBlockMethods, IBlockMethods } from "../../components/block/methods";
import Orgs from "../../components/block/org/Orgs";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { getBlocksAsArray } from "../../redux/blocks/selectors";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import { getCurrentOrg } from "../../redux/view/selectors";
import { setCurrentOrg } from "../../redux/view/actions";

export interface IOrgsContainerProps {
  blockHandlers: IBlockMethods;
  user: IUser;
  areOrgsLoaded: boolean;
  onSelectOrg: (orgID?: string) => void;
  orgs?: IBlock[];
  currentOrg?: IBlock;
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
      if (!this.props.user.loadingRootData) {
        try {
          this.setState({ loading: true });
          await this.props.blockHandlers.fetchRootData();
          this.setState({ loading: false, error: undefined });
        } catch (error) {
          this.setState({ error, loading: false });
        }
      }
    }
  }

  public render() {
    const { orgs, blockHandlers, user, onSelectOrg, currentOrg } = this.props;
    const { error, loading } = this.state;

    if (loading) {
      return "Loading";
    } else if (error) {
      return "An error occurred";
    }

    return (
      <Orgs
        orgs={orgs!}
        blockHandlers={blockHandlers}
        user={user}
        onSelectOrg={onSelectOrg}
        currentOrg={currentOrg}
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

function mergeProps(state: IReduxState, { dispatch }: { dispatch: Dispatch }) {
  const user = getSignedInUserRequired(state);
  const blockHandlers = getBlockMethods({
    state,
    dispatch
  });

  const orgs = getBlocksAsArray(state, user.orgs);
  const areOrgsLoaded = orgs.length === user.orgs.length;
  const currentOrg = getCurrentOrg(state);

  return {
    blockHandlers,
    areOrgsLoaded,
    user,
    orgs,
    currentOrg,
    onSelectOrg(orgID?: string) {
      dispatch(setCurrentOrg(orgID));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(OrgsContainer);
