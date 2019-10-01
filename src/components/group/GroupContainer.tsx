import { connect, DispatchProp } from "react-redux";
import { Dispatch } from "redux";
import { BlockType, IBlock } from "../../models/block/block";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import blockDataLoader from "../block/blockDataLoader";
import { getBlockMethods } from "../block/methods";
import { BoardContext } from "../board/Board";
import GroupViewManager from "./GroupViewManager";

export interface IGroupContainerProps {
  group: IBlock;
  draggableID: string;
  index: number;
  context: BoardContext;
  selectedCollaborators: { [key: string]: boolean };
  toggleForm: (type: BlockType, block: IBlock) => void;
  onClickAddChild: (type: BlockType, group: IBlock) => void;
  setCurrentProject: (project: IBlock) => void;
  onViewMore: () => void;
  disabled?: boolean;
  withViewMore?: boolean;
}

function mapStateToProps(state: IReduxState) {
  console.log("map state");
  return state;
}

function mapDispatchToProps(dispatch: Dispatch) {
  console.log("map dispatch");
  return { dispatch };
}

function mergeProps(
  state: IReduxState,
  { dispatch }: DispatchProp,
  ownProps: IGroupContainerProps
) {
  console.log("merge props");
  const user = getSignedInUserRequired(state);
  const { view, blockData } = blockDataLoader(state, dispatch, {
    block: ownProps.group
  });

  return {
    currentView: view,
    group: ownProps.group,
    readyProps:
      view.viewName === "ready"
        ? {
            ...ownProps,
            user,
            tasks: blockData.tasks!,
            projects: blockData.projects!,
            blockHandlers: getBlockMethods(state, dispatch)
          }
        : undefined
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(GroupViewManager);
