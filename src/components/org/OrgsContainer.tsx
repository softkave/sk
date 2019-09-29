import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IBlock } from "../../models/block/block";
import { getBlocksAsArray } from "../../redux/blocks/selectors";
import loadRootBlocksOperation from "../../redux/operations/block/loadRootBlock";
import { loadRootBlocksOperationID } from "../../redux/operations/operationIDs";
import { getOperationsWithID } from "../../redux/operations/selectors";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import {
  popView,
  setCurrentOrg,
  setCurrentProject
} from "../../redux/view/actions";
import { currentOrgViewName, orgsViewName } from "../../redux/view/orgs";
import { currentProjectViewName } from "../../redux/view/project";
import {
  getCurrentOrg,
  getCurrentProject,
  getCurrentView
} from "../../redux/view/selectors";
import { getBlockMethods } from "../block/methods";
import getViewFromOperations from "../view/getViewFromOperations";
import OrgsViewManager from "./OrgsViewManager";

function mapStateToProps(state: IReduxState) {
  return state;
}

function mapDispatchToProps(dispatch: Dispatch) {
  return { dispatch };
}

function mergeProps(state: IReduxState, { dispatch }: { dispatch: Dispatch }) {
  const loadInitialBlocksOperation = getOperationsWithID(
    state,
    loadRootBlocksOperationID
  )[0];

  const user = getSignedInUserRequired(state);
  const orgs = getBlocksAsArray(state, user.orgs);
  const currentView = getCurrentView(state)!;

  if (currentView.viewName === orgsViewName) {
    const view = getViewFromOperations([loadInitialBlocksOperation]);

    if (!loadInitialBlocksOperation) {
      // TODO: move to componentDidMount
      loadRootBlocksOperation(state, dispatch);

      return {
        view
      };
    } else {
      return {
        view,
        orgsProps: {
          user,
          orgs,
          blockHandlers: getBlockMethods(state, dispatch),
          onSelectOrg(org: IBlock) {
            dispatch(setCurrentOrg(org));
          },
          onSelectProject(project: IBlock) {
            dispatch(setCurrentProject(project));
          }
        }
      };
    }
  } else if (
    currentView.viewName === currentOrgViewName ||
    currentView.viewName === currentProjectViewName
  ) {
    let block: IBlock;

    if (currentView.viewName === currentOrgViewName) {
      block = getCurrentOrg(state)!;
    } else if (currentView.viewName === currentProjectViewName) {
      block = getCurrentProject(state)!;
    } else {
      throw new Error("Application error");
    }

    return {
      view: currentView,
      currentBlockProps: {
        block,
        blockID: block.customId,
        isFromRoot: false,
        isUserRootBlock: false,
        onSelectProject(project: IBlock) {
          dispatch(setCurrentProject(project));
        },
        onBack() {
          dispatch(popView());
        }
      }
    };
  } else {
    throw new Error("Application error");
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(OrgsViewManager);
