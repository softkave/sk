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
import { currentOrgViewName } from "../../redux/view/orgs";
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

  const view = loadInitialBlocksOperation
    ? getViewFromOperations([loadInitialBlocksOperation])
    : getCurrentView(state)!;

  const user = getSignedInUserRequired(state);
  const orgs = getBlocksAsArray(state, user.orgs);

  if (
    view.viewName === currentOrgViewName ||
    view.viewName === currentProjectViewName
  ) {
    let block: IBlock;

    if (view.viewName === currentOrgViewName) {
      block = getCurrentOrg(state)!;
    } else if (view.viewName === currentProjectViewName) {
      block = getCurrentProject(state)!;
    } else {
      throw new Error("Application error");
    }

    return {
      view,
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
  } else if (!loadInitialBlocksOperation || user.orgs.length === orgs.length) {
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
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(OrgsViewManager);
