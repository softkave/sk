import React from "react";
import { connect } from "react-redux";

import { Dispatch } from "redux";
import { getBlockMethods, IBlockMethods } from "../../components/block/methods";
import Orgs from "../../components/org/Orgs";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { getBlocksAsArray } from "../../redux/blocks/selectors";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import { clearViewsFrom, setCurrentOrg } from "../../redux/view/actions";
import { currentOrgViewName } from "../../redux/view/orgs";
import { getCurrentOrg } from "../../redux/view/selectors";

export interface IOrgsContainerProps {
  blockHandlers: IBlockMethods;
  user: IUser;
  areOrgsLoaded: boolean;
  onSelectOrg: (orgID: IBlock) => void;
  onBack: () => void;
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
          await this.props.blockHandlers.loadRootData();
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
    onSelectOrg(org: IBlock) {
      dispatch(setCurrentOrg(org));
    },
    onBack() {
      dispatch(clearViewsFrom(currentOrgViewName));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(OrgsContainer);
