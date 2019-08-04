import React from "react";
import { connect } from "react-redux";

import { getBlockMethods, IBlockMethods } from "../../components/block/methods";
import Orgs from "../../components/block/org/Orgs";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";

export interface IOrgsContainerProps {
  blockHandlers: IBlockMethods;
  user: IUser;
  orgs?: IBlock[];
}

interface IOrgsContainerState {
  error?: Error;
}

class OrgsContainer extends React.Component<
  IOrgsContainerProps,
  IOrgsContainerState
> {
  constructor(props) {
    super(props);
    this.state = {
      error: undefined
    };
  }

  public async componentDidMount() {
    if (!this.props.orgs) {
      try {
        await this.props.blockHandlers.fetchRootData();
      } catch (error) {
        this.setState({ error });
      }
    }
  }

  public render() {
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
  const blockHandlers = getBlockMethods({
    state,
    dispatch,
    user: state.user.user
  });

  return {
    blockHandlers,
    // rootBlock: state.rootBlock,
    user: state.user.user,
    orgs: state.orgs
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(OrgsContainer);
