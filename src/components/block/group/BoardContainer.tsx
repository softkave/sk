import get from "lodash/get";
import React from "react";
import { connect } from "react-redux";

import { IBlock } from "../../../models/block/block";
import { getBlock } from "../../../redux/blocks/selectors";
import { getSignedInUser } from "../../../redux/session/selectors";
import { getUsersAsArray } from "../../../redux/users/selectors";
import { getBlockMethods, IBlockMethods } from "../methods";
import Board, { IBoardProps } from "./Board";
import { IUser } from "../../../models/user/user";

interface IInternalBoardContainerProps extends IBoardProps {
}

class BoardContainer extends React.Component<IInternalBoardContainerProps> {
  public render() {
    return <Board {...this.props} />;
  }
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return dispatch;
}

export interface IBoardContainerProps {
  blockID: string;
  block?: IBlock;
  onBack: () => void;
  isFromRoot?: boolean;
  isUserRootBlock?: boolean;

  // TODO: Define the right type
  collaborators?: IUser[];
}

function mergeProps(state, dispatch, ownProps: IBoardContainerProps): IInternalBoardContainerProps {
  const user = getSignedInUser(state);
  const block = ownProps.block || getBlock(state, ownProps.blockID);
  const blockHandlers = getBlockMethods({
    dispatch,
    state
  });

  const collaborators =
    block.type === "org"
      ? getUsersAsArray(state, block!.collaborators!)
      : ownProps.collaborators;

  return {
    blockHandlers,
    user,
    block,
    collaborators,
    isFromRoot: ownProps.isFromRoot,
    isUserRootBlock: ownProps.isUserRootBlock,
    onBack: ownProps.onBack
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(BoardContainer);
