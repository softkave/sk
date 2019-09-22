import uniq from "lodash/uniq";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { IBlock } from "../../models/block/block";
import { INotification } from "../../models/notification/notification";
import loadBlockChildrenOperation from "../../redux/operations/block/loadBlockChildren";
import loadBlockCollaborationRequestsOperation from "../../redux/operations/block/loadBlockCollaborationRequests";
import loadBlockCollaboratorsOperation from "../../redux/operations/block/loadBlockCollaborators";
import {
  isOperationCompleted,
  isOperationError,
  isOperationPending,
  isOperationStarted
} from "../../redux/operations/operation";
import {
  getBlockChildrenOperationID,
  getBlockCollaborationRequestsOperationID,
  getBlockCollaboratorsOperationID
} from "../../redux/operations/operationIDs";
import { getOperationWithIDForResource } from "../../redux/operations/selectors";
import { IReduxState } from "../../redux/store";

interface IBlockData {
  projects?: IBlock[];
  groups?: IBlock[];
  tasks?: IBlock[];
  collaborators?: IUser[];
  collaborationRequests?: INotification[];
}

export interface IBlockInternalDataLoaderProps {
  // blockID: string;
  block: IBlock;
  blockType: BlockType;
  render: (renderParams: {
    block: IBlock;
    blockChildren: IBlockData;
    collaborators: IUser[];
    collaborationRequests: INotification[];
    user: IUser;
    blockHandlers: IBlockMethods;
  }) => React.ReactNode;
}

type BlockInternalDataToLoad =
  | "collaborators"
  | "collaborationRequests"
  | "children";

function getBlockInternalDataToLoad(
  blockType: BlockType
): BlockInternalDataToLoad[] {
  switch (blockType) {
    case "root":
    case "org": {
      return ["collaborators", "collaborationRequests", "children"];
    }

    case "project": {
      return ["children"];
    }

    case "group": {
      return ["children"];
    }

    case "task": {
      return [];
    }

    default:
      return [];
  }
}

function pluralize(blockChildrenTypes: string[]) {
  return blockChildrenTypes.map(type => `${type}s`);
}

function areBlockDataLoaded(
  block: IBlock,
  data: IBlockData,
  propNames: string[]
) {
  return (
    propNames.findIndex(propName => {
      const propDataInBlock = uniq(block[propName]);
      const propDataInData = uniq(data[propName]);

      if (
        Array.isArray(block[propName]) &&
        Array.isArray(data[propName]) &&
        propDataInBlock.length === propDataInData.length
      ) {
        return false;
      }

      return true;
    }) === -1
  );
}

function areBlockChildrenLoaded(block: IBlock, blockChildren: IBlockData) {
  const childrenTypes = getBlockValidChildrenTypes(block);
  const pluralTypes = pluralize(childrenTypes);

  return areBlockDataLoaded(block, blockChildren, pluralTypes);
}

// TODO: Collaborator is slightly different from IUser
function areBlockCollaboratorsLoaded(block: IBlock, collaborators?: IUser[]) {
  if (block.type === "org" || block.type === "root") {
    return areBlockDataLoaded(block, { collaborators }, ["collaborators"]);
  } else {
    return true;
  }
}

function areBlockCollaborationRequestsLoaded(
  block: IBlock,
  requests?: INotification[]
) {
  if (block.type === "org" || block.type === "root") {
    return areBlockDataLoaded(block, { collaborationRequests: requests }, [
      "collaborationRequests"
    ]);
  } else {
    return true;
  }
}

function loadBlockChildrenFromRedux(state: IReduxState, block: IBlock) {
  const childrenByPluralType: IBlockData = {};
  const childrenTypes = getBlockValidChildrenTypes(block);
  const pluralTypes = pluralize(childrenTypes);

  pluralTypes.forEach(typePropName => {
    const ids = block[typePropName];

    if (Array.isArray(ids)) {
      childrenByPluralType[typePropName] = getBlocksAsArray(state, ids);
    }
  });

  return childrenByPluralType;
}

function loadBlockCollaboratorsFromRedux(state: IReduxState, block: IBlock) {
  if (Array.isArray(block.collaborators)) {
    return getUsersAsArray(state, block.collaborators);
  }
}

function loadBlockCollaborationRequestsFromRedux(
  state: IReduxState,
  block: IBlock
) {
  if (Array.isArray(block.collaborationRequests)) {
    return getNotificationsAsArray(state, block.collaborationRequests);
  }
}

function getBlockCollaborators(
  block: IBlock,
  blockType: BlockType,
  state: IReduxState
) {
  // console.log("getBlockCollaborators", { block });
  // The last check is for Ungrouped category
  if (
    blockType === "org" ||
    blockType === "root" ||
    (Array.isArray(block.parents) && block.parents.length === 0)
  ) {
    return loadBlockCollaboratorsFromRedux(block, state);
  } else {
    const block0 = getBlock(state, block.parents[0]);
    return loadBlockCollaboratorsFromRedux(block0, state);
  }
}

function shouldLoadBlockChildren(state: IReduxState, block: IBlock) {
  const loadChildrenOperation = getLoadChildrenOperation(state, block);
  const blockChildren = loadBlockChildrenFromRedux(state, block);

  if (
    loadChildrenOperation &&
    isOperationStarted(loadChildrenOperation) &&
    areBlockChildrenLoaded(block, blockChildren)
  ) {
    return false;
  }

  return true;
}

function getLoadChildrenOperation(state: IReduxState, block: IBlock) {
  return getOperationWithIDForResource(
    state,
    getBlockChildrenOperationID,
    block.customId
  );
}

function shouldLoadRequests(state: IReduxState, block: IBlock) {
  const loadRequestsOperation = getLoadRequestsOperation(state, block);
  const requests = loadBlockCollaborationRequestsFromRedux(state, block);

  if (
    loadRequestsOperation &&
    isOperationStarted(loadRequestsOperation) &&
    areBlockCollaborationRequestsLoaded(block, requests)
  ) {
    return false;
  }

  return true;
}

function getLoadRequestsOperation(state: IReduxState, block: IBlock) {
  return getOperationWithIDForResource(
    state,
    getBlockCollaborationRequestsOperationID,
    block.customId
  );
}

function shouldLoadCollaborators(state: IReduxState, block: IBlock) {
  const loadCollaboratorsOperation = getLoadCollaboratorsOperation(
    state,
    block
  );
  const collaborators = loadBlockCollaboratorsFromRedux(state, block);

  if (
    loadCollaboratorsOperation &&
    isOperationStarted(loadCollaboratorsOperation) &&
    areBlockCollaboratorsLoaded(block, collaborators)
  ) {
    return false;
  }

  return true;
}

function getLoadCollaboratorsOperation(state: IReduxState, block: IBlock) {
  return getOperationWithIDForResource(
    state,
    getBlockCollaboratorsOperationID,
    block.customId
  );
}

function loadData(state: IReduxState, dispatch: Dispatch, block: IBlock) {
  if (shouldLoadBlockChildren(state, block)) {
    loadBlockChildrenOperation(state, dispatch, block);
  }

  if (shouldLoadCollaborators(state, block)) {
    loadBlockCollaboratorsOperation(state, dispatch, block);
  }

  if (shouldLoadRequests(state, block)) {
    loadBlockCollaborationRequestsOperation(state, dispatch, block);
  }
}

function getView(state: IReduxState, block: IBlock) {
  const loadChildrenOperation = getLoadChildrenOperation(state, block);
  const loadCollaboratorsOperation = getLoadCollaboratorsOperation(
    state,
    block
  );
  const loadRequestsOperation = getLoadRequestsOperation(state, block);

  if (
    !loadChildrenOperation ||
    !loadCollaboratorsOperation ||
    !loadRequestsOperation
  ) {
    return {
      viewName: "loading"
    };
  }

  const operations = [
    loadChildrenOperation!,
    loadCollaboratorsOperation!,
    loadRequestsOperation!
  ];

  if (
    operations.find(operation => {
      return isOperationStarted(operation) || isOperationPending(operation);
    })
  ) {
    return {
      viewName: "loading"
    };
  }

  if (
    operations.find(operation => {
      return isOperationError(operation);
    })
  ) {
    return {
      viewName: "error"
    };
  }

  if (
    operations.find(operation => {
      return isOperationCompleted(operation);
    })
  ) {
    return {
      viewName: "ready"
    };
  }

  // TODO: Track errors globally and report them
  throw new Error("Status check failed");
}

function getViewProps(state: IReduxState, block: IBlock, viewName: string) {
  switch (viewName) {
    case "loading":
      return null;

    case "error": {
      // TODO: return errors from statuses and display
      return null;
    }

    case "ready": {
      const blockChildren = loadBlockChildrenFromRedux(state, block);
      const collaborators = loadBlockCollaboratorsFromRedux(state, block);
      const requests = loadBlockCollaborationRequestsFromRedux(state, block);

      return {
        blockChildren,
        collaborators,
        requests
      };
    }

    default: {
      throw new Error("Invalid view name");
    }
  }
}

function mapStateToProps(state: IReduxState) {
  return state;
}

function mapDispatchToProps(dispatch: Dispatch) {
  return { dispatch };
}

export default function mergeProps(
  state: IReduxState,
  { dispatch }: { dispatch: Dispatch },
  ownProps: IBlockInternalDataLoaderProps
) {
  const block = ownProps.block;
  const view = getView(state, block);
  const viewProps = getViewProps(state, block, view.viewName);
  loadData(state, dispatch, block);
}
