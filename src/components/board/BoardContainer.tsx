import { connect } from "react-redux";
import { IBlock } from "../../models/block/block";
import { getBlock, getBlockParents } from "../../redux/blocks/selectors";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import blockDataLoader from "../block/blockDataLoader";
import { getBlockMethods } from "../block/methods";
import BlockViewManager from "./BoardViewManager";

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export interface IBoardContainerProps {
  blockID: string;
  onBack: () => void;
  onSelectProject: (project: IBlock) => void;
  isFromRoot?: boolean;
  isUserRootBlock?: boolean;
  block?: IBlock;
}

function mergeProps(state, { dispatch }, ownProps: IBoardContainerProps) {
  const user = getSignedInUserRequired(state);
  const block = ownProps.block || getBlock(state, ownProps.blockID)!;
  const blockHandlers = getBlockMethods(state, dispatch);
  const { view, blockData } = blockDataLoader(state, dispatch, {
    block: block!
  });

  return {
    block: block!,
    currentView: view,
    readyProps:
      view.viewName === "ready"
        ? {
            ...ownProps,
            block,
            user,
            blockHandlers,
            tasks: blockData.tasks!,
            projects: blockData.projects!,
            groups: blockData.groups!,
            collaborators: blockData.collaborators!,
            collaborationRequests: blockData.collaborationRequests!,
            parents: getBlockParents(state, block!)
          }
        : undefined
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(BlockViewManager);
