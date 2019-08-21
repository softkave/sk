import { connect } from "react-redux";
import { Dispatch } from "redux";

import { IPromise } from "q";
import { IBlock } from "../../../models/block/block";
import { getBlockValidChildrenTypes } from "../../../models/block/utils";
import { INotification } from "../../../models/notification/notification";
import { IUser } from "../../../models/user/user";
import { updateBlockRedux } from "../../../redux/blocks/actions";
import { getBlocksAsArray } from "../../../redux/blocks/selectors";
import { getNotificationsAsArray } from "../../../redux/notifications/selectors";
import { IReduxState } from "../../../redux/store";
import { getUsersAsArray } from "../../../redux/users/selectors";
import { getBlockMethods, IBlockMethods } from "../methods";
import DataLoader, { IDataLoaderProps } from "./DataLoader";

function mapStateToProps(state: IReduxState) {
  return state;
}

function mapDispatchToProps(dispatch: Dispatch) {
  return dispatch;
}

interface IBlockChildren {
  projects?: IBlock[];
  groups?: IBlock[];
  tasks?: IBlock[];
}

export interface IBlockInternalDataLoaderProps {
  block: IBlock;
  render: (renderParams: {
    block: IBlock;
    blockChildren: IBlockChildren;
    collaborators?: IUser[];
    collaborationRequests?: INotification[];
  }) => React.ReactNode;
}

type BlockInternalDataTypes =
  | "collaborators"
  | "collaborationRequests"
  | "children";

function getDefaultBlockInternalDataToLoad(
  block: IBlock
): BlockInternalDataTypes[] {
  switch (block.type) {
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

async function loadBlockInternalDataFromNet(
  block: IBlock,
  dataToLoad: BlockInternalDataTypes[],
  blockHandlers: IBlockMethods
) {
  const promises: Array<IPromise<any>> = [];

  dataToLoad.forEach(identifier => {
    switch (identifier) {
      case "collaborators": {
        if (!block.loadingChildren) {
          promises.push(blockHandlers.getCollaborators({ block }));
        }

        break;
      }

      case "collaborationRequests": {
        if (!block.loadingCollaborationRequests) {
          promises.push(blockHandlers.getCollaborationRequests({ block }));
        }

        break;
      }

      case "children": {
        if (!block.loadingCollaborators) {
          promises.push(
            blockHandlers.getBlockChildren({
              block,
              updateBlock: blockHandlers.onUpdate
            })
          );
        }

        break;
      }

      default:
        throw new Error("Invalid block data identifier");
    }
  });

  return Promise.all(promises);
}

function pluralizeBlockChildrenTypes(blockChildrenTypes: string[]) {
  return blockChildrenTypes.map(type => `${type}s`);
}

function areBlockChildrenLoaded(block: IBlock, blockChildren: IBlockChildren) {
  const blockChildrenTypes = getBlockValidChildrenTypes(block);
  const blockTypesToPropName = pluralizeBlockChildrenTypes(blockChildrenTypes);

  return (
    blockTypesToPropName.findIndex(propName => {
      if (
        Array.isArray(block[propName]) &&
        Array.isArray(blockChildren[propName]) &&
        block[propName].length === blockChildren[propName].length
      ) {
        return true;
      }

      return false;
    }) === -1
  );
}

// TODO: Collaborator is slightly different from IUser
function areBlockCollaboratorsLoaded(block: IBlock, collaborators?: IUser[]) {
  if (
    Array.isArray(block.collaborators) &&
    Array.isArray(collaborators) &&
    block.collaborators.length === collaborators.length
  ) {
    return true;
  }

  return false;
}

function areBlockCollaborationRequestsLoaded(
  block: IBlock,
  requests?: INotification[]
) {
  if (
    Array.isArray(block.collaborationRequests) &&
    Array.isArray(requests) &&
    block.collaborationRequests.length === requests.length
  ) {
    return true;
  }

  return false;
}

function loadBlockChildrenFromRedux(block: IBlock, state: IReduxState) {
  const blockChildrenByPluralizedType: IBlockChildren = {};
  const blockChildrenTypes = getBlockValidChildrenTypes(block);
  const pluralizedChildrenTypes = pluralizeBlockChildrenTypes(
    blockChildrenTypes
  );

  pluralizedChildrenTypes.forEach(pluralType => {
    const ids = block[pluralType];

    if (Array.isArray(ids)) {
      blockChildrenByPluralizedType[pluralType] = getBlocksAsArray(state, ids);
    }
  });

  return blockChildrenByPluralizedType;
}

function loadBlockCollaboratorsFromRedux(block: IBlock, state: IReduxState) {
  if (Array.isArray(block.collaborators)) {
    return getUsersAsArray(state, block.collaborators);
  }
}

function loadBlockCollaborationRequestsFromRedux(
  block: IBlock,
  state: IReduxState
) {
  if (Array.isArray(block.collaborationRequests)) {
    return getNotificationsAsArray(state, block.collaborationRequests);
  }
}

function mergeProps(
  state: IReduxState,
  dispatch: Dispatch,
  ownProps: IBlockInternalDataLoaderProps
): IDataLoaderProps {
  const block = ownProps.block;
  const blockHandlers = getBlockMethods({ state, dispatch });
  const blockChildren = loadBlockChildrenFromRedux(block, state);
  const collaborators = loadBlockCollaboratorsFromRedux(block, state);
  const collaborationRequests = loadBlockCollaborationRequestsFromRedux(
    block,
    state
  );

  const childrenLoaded = areBlockChildrenLoaded(block, blockChildren);
  const collaboratorsLoaded = areBlockCollaboratorsLoaded(block, collaborators);
  const requestsLoaded = areBlockCollaborationRequestsLoaded(
    block,
    collaborationRequests
  );

  const blockInternalDataToLoad = getDefaultBlockInternalDataToLoad(
    block
  ).filter(dataName => {
    switch (dataName) {
      case "children": {
        return childrenLoaded;
      }

      case "collaborationRequests": {
        return requestsLoaded;
      }

      case "collaborators": {
        return collaboratorsLoaded;
      }

      default: {
        throw new Error(`Unknown internal block data name ${dataName}`);
      }
    }
  });

  return {
    data: block,
    isDataLoaded: () => {
      return childrenLoaded && collaboratorsLoaded && requestsLoaded;
    },
    areDataSame: (data1: IBlock, data2: IBlock) =>
      data1.customId === data2.customId,
    loadData: async () => {
      dispatch(
        updateBlockRedux(block.customId, {
          loadingChildren: true,
          loadingCollaborators: true,
          loadingCollaborationRequests: true
        })
      );
      await loadBlockInternalDataFromNet(
        block,
        blockInternalDataToLoad,
        blockHandlers
      );

      dispatch(
        updateBlockRedux(block.customId, {
          loadingChildren: false,
          loadingCollaborators: false,
          loadingCollaborationRequests: false
        })
      );
    },
    render: () =>
      ownProps.render({
        block,
        blockChildren,
        collaborators,
        collaborationRequests
      })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DataLoader);
