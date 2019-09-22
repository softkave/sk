import React from "react";
import { connect } from "react-redux";

import { IBlock } from "../../../models/block/block";
import { getBlock } from "../../../redux/blocks/selectors";
import { getSignedInUser } from "../../../redux/session/selectors";
import { getBlockMethods } from "../methods";
import BlockInternalDataLoader, {
  IBlockInternalDataLoaderProps
} from "./BlockDataLoaderContainer";
import Board from "../board/Board";

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export interface IBoardContainerProps {
  blockID: string;
  block?: IBlock;
  onBack: () => void;
  isFromRoot?: boolean;
  isUserRootBlock?: boolean;
}

function mergeProps(
  state,
  { dispatch },
  ownProps: IBoardContainerProps
): IBlockInternalDataLoaderProps {
  const user = getSignedInUser(state);
  const block = ownProps.block || getBlock(state, ownProps.blockID);
  const blockHandlers = getBlockMethods({
    dispatch,
    state
  });

  return {
    block,
    blockType: block.type,
    render: ({ collaborators, blockChildren, collaborationRequests }) => {
      return (
        <Board
          block={block}
          blockHandlers={blockHandlers}
          user={user!}
          onBack={ownProps.onBack}
          isFromRoot={ownProps.isFromRoot}
          isUserRootBlock={ownProps.isUserRootBlock}
          collaborators={collaborators!}
          projects={blockChildren.projects}
          groups={blockChildren.groups}
          tasks={blockChildren.tasks}
          collaborationRequests={collaborationRequests!}
        />
      );
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(BlockInternalDataLoader);
