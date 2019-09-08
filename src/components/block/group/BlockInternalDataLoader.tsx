import uniq from "lodash/uniq";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { BlockType, IBlock } from "../../../models/block/block";
import { getBlockValidChildrenTypes } from "../../../models/block/utils";
import { INotification } from "../../../models/notification/notification";
import { IUser } from "../../../models/user/user";
import { updateBlockRedux } from "../../../redux/blocks/actions";
import { getBlock, getBlocksAsArray } from "../../../redux/blocks/selectors";
import { getNotificationsAsArray } from "../../../redux/notifications/selectors";
import { getSignedInUser } from "../../../redux/session/selectors";
import { IReduxState } from "../../../redux/store";
import { getUsersAsArray } from "../../../redux/users/selectors";
import { getBlockMethods, IBlockMethods } from "../methods";
import DataLoader, { IDataLoaderProps } from "./DataLoader";

function mapStateToProps(state: IReduxState) {
  return state;
}

function mapDispatchToProps(dispatch: Dispatch) {
  return { dispatch };
}

interface IBlockChildren {
  projects?: IBlock[];
  groups?: IBlock[];
  tasks?: IBlock[];
}

export interface IBlockInternalDataLoaderProps {
  // blockID: string;
  block: IBlock;
  blockType: BlockType;
  render: (renderParams: {
    block: IBlock;
    blockChildren: IBlockChildren;
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

async function loadBlockInternalDataFromNet(
  block: IBlock,
  dataToLoad: BlockInternalDataToLoad[],
  blockHandlers: IBlockMethods
) {
  const promises: Array<Promise<any>> = [];

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

function pluralize(blockChildrenTypes: string[]) {
  return blockChildrenTypes.map(type => `${type}s`);
}

function areBlockChildrenLoaded(block: IBlock, blockChildren: IBlockChildren) {
  const childrenTypes = getBlockValidChildrenTypes(block);
  const pluralizedBlockTypes = pluralize(childrenTypes);
  console.log({ block, pluralizedBlockTypes, blockChildren });

  return (
    // find children that isn't loaded yet
    pluralizedBlockTypes.findIndex(propName => {
      // TODO: move this to the redux reducer or to the update action
      const s1 = uniq(block[propName]);
      const s2 = uniq(blockChildren[propName]);
      console.log({ s1, s2, propName });

      if (
        Array.isArray(block[propName]) &&
        Array.isArray(blockChildren[propName]) &&
        s1.length === s2.length
      ) {
        return false;
      }

      return true;
    }) === -1
  );
}

// TODO: Collaborator is slightly different from IUser
function areBlockCollaboratorsLoaded(block: IBlock, collaborators?: IUser[]) {
  const s1 = uniq(block.collaborators);
  const s2 = uniq(collaborators);

  if (
    Array.isArray(block.collaborators) &&
    Array.isArray(collaborators) &&
    s1.length === s2.length
  ) {
    return true;
  }

  return false;
}

function areBlockCollaborationRequestsLoaded(
  block: IBlock,
  requests?: INotification[]
) {
  const s1 = uniq(block.collaborationRequests);
  const s2 = uniq(requests);

  if (
    Array.isArray(block.collaborationRequests) &&
    Array.isArray(requests) &&
    s1.length === s2.length
  ) {
    return true;
  }

  return false;
}

function loadBlockChildrenFromRedux(block: IBlock, state: IReduxState) {
  const childrenByPluralizedType: IBlockChildren = {};
  const childrenTypes = getBlockValidChildrenTypes(block);
  const pluralizedTypes = pluralize(childrenTypes);

  pluralizedTypes.forEach(typePropName => {
    const ids = block[typePropName];

    if (Array.isArray(ids)) {
      childrenByPluralizedType[typePropName] = getBlocksAsArray(state, ids);
    }
  });

  return childrenByPluralizedType;
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

function getBlockCollaborators(
  block: IBlock,
  blockType: BlockType,
  state: IReduxState
) {
  console.log("getBlockCollaborators", { block });
  // The last check is for Ungrouped category
  if (
    blockType === "org" ||
    blockType === "root" ||
    (Array.isArray(block.parents) && block.parents.length === 0)
  ) {
    return loadBlockCollaboratorsFromRedux(block, state);
  } else {
    const block0 = getBlock(state, block.parents[0]);
    console.log({ block0 });
    return loadBlockCollaboratorsFromRedux(block0, state);
  }
}

function mergeProps(
  state: IReduxState,
  { dispatch }: { dispatch: Dispatch },
  ownProps: IBlockInternalDataLoaderProps
): IDataLoaderProps {
  console.log(ownProps);
  const user = getSignedInUser(state);
  // const stateBlock = getBlock(state, ownProps.blockID);
  // const block = stateBlock || ownProps.block;
  const block = ownProps.block;
  const blockHandlers = getBlockMethods({ state, dispatch });
  const blockChildren = loadBlockChildrenFromRedux(block, state);
  const collaborators = getBlockCollaborators(block, ownProps.blockType, state);
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

  const blockInternalDataToLoad = getBlockInternalDataToLoad(
    ownProps.blockType
  ).filter(dataName => {
    switch (dataName) {
      case "children": {
        return !childrenLoaded;
      }

      case "collaborationRequests": {
        return !requestsLoaded;
      }

      case "collaborators": {
        return !collaboratorsLoaded;
      }

      default: {
        throw new Error(`Unknown internal block data name ${dataName}`);
      }
    }
  });

  console.log({
    block,
    childrenLoaded,
    collaboratorsLoaded,
    requestsLoaded,
    blockInternalDataToLoad
  });

  return {
    data: block,
    isDataLoaded: () => {
      console.log({
        isDataLoaded: childrenLoaded && collaboratorsLoaded && requestsLoaded
      });
      return childrenLoaded && collaboratorsLoaded && requestsLoaded;
    },
    areDataSame: (data1: IBlock, data2: IBlock) => {
      return data1.customId === data2.customId;
    },
    loadData: async () => {
      dispatch(
        updateBlockRedux(
          block.customId,
          {
            loadingChildren: true,
            loadingCollaborators: true,
            loadingCollaborationRequests: true
          },
          { arrayUpdateStrategy: "merge" }
        )
      );

      await loadBlockInternalDataFromNet(
        block,
        blockInternalDataToLoad,
        blockHandlers
      );

      dispatch(
        updateBlockRedux(
          block.customId,
          {
            loadingChildren: false,
            loadingCollaborators: false,
            loadingCollaborationRequests: false
          },
          { arrayUpdateStrategy: "merge" }
        )
      );
    },
    render: () => {
      return ownProps.render({
        block,
        blockChildren,
        blockHandlers,
        user: user!,
        collaborators: collaborators || [],
        collaborationRequests: collaborationRequests || []
      });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DataLoader);
