import dotProp from "dot-prop-immutable";
import randomColor from "randomcolor";

import { Dispatch } from "redux";
import { IBlock } from "../../models/block/block";
import { getBlockValidChildrenTypes } from "../../models/block/utils";
import { IUser } from "../../models/user/user";
import netInterface from "../../net/index";
import { INetResult } from "../../net/query";
import {
  addBlockRedux,
  bulkAddBlocksRedux,
  deleteBlockRedux,
  updateBlockRedux
} from "../../redux/blocks/actions";
import { bulkAddNotificationsRedux } from "../../redux/notifications/actions";
import {
  getResourceParam,
  getResourceParamArray
} from "../../redux/referenceCounting";
import { bulkAddUsersRedux, updateUserRedux } from "../../redux/users/actions";
import { newId } from "../../utils/utils";
import { IPipeline, makePipeline, PipelineEntryFunc } from "../FormPipeline";

function convertDateToTimestamp(date) {
  if (date && date.valueOf) {
    return date.valueOf();
  }
}

function move(list, id, dropPosition) {
  const idIndex = list.indexOf(id);
  list = [...list];
  list.splice(idIndex, 1);
  list.splice(dropPosition, 0, id);
  return list;
}

function remove(list, id) {
  const idIndex = list.indexOf(id);
  list = [...list];
  list.splice(idIndex, 1);
  return list;
}

function add(list, id, dropPosition) {
  list = [...list];
  list.splice(dropPosition, 0, id);
  return list;
}

function getIndex(list, id) {
  const idIndex = list.indexOf(id);
  return idIndex;
}

// TODO: Define the return types of the pipeline methods
// TODO: Add the type of the handleError function amdn maybe validate in the runtime
// TODO: Consider validating the pipeline methods arguments in runtime
// TODO: Add ResultType to the pipelines

interface IAddBlockParams {
  block: IBlock;
  user: IUser;
  parent: IBlock;
}

const addBlockMethods: IPipeline<
  IAddBlockParams,
  IAddBlockParams,
  INetResult,
  INetResult
> = {
  process({ params }) {
    const { block, parent, user } = params;

    block.createdAt = Date.now();
    block.createdBy = user.customId;
    block.customId = newId();
    block.color = randomColor();
    block.expectedEndAt = convertDateToTimestamp(block.expectedEndAt);
    block.groupTaskContext = [];
    block.groupProjectContext = [];

    const childrenTypes = getBlockValidChildrenTypes(block);

    if (parent) {
      block.parents = [];

      if (parent.parents) {
        block.parents = block.parents.concat(parent.parents);
      }

      const type = `${block.type}s`;
      block.parents.push(parent.customId);
      parent[type].push(block.customId);

      if (block.type === "group") {
        parent.groupTaskContext.push(block.customId);
        parent.groupProjectContext.push(block.customId);
      }
    }

    if (block.type === "org") {
      block.collaborators = [user.customId];
    } else if (block.type === "task") {
      if (!block.taskCollaborators) {
        block.taskCollaborators = [];
      }
    }

    if (childrenTypes.length > 0) {
      childrenTypes.forEach(type => {
        const pluralizedType = `${type}s`;
        block[type] = {};
        block[pluralizedType] = [];
      });
    }

    return { ...params, parent, block };
  },

  async net({ params }) {
    const { block } = params;
    return await netInterface("block.addBlock", { block });
  },

  handleError: { stripBaseNames: ["block"] },

  redux({ state, dispatch, params }) {
    const { block, parent } = params;

    if (parent) {
      dispatch(updateBlockRedux(getResourceParam(parent, "customId")));
    }

    if (block.type === "org") {
      dispatch(
        updateUserRedux({
          id: params.user.customId,
          resource: { orgs: [block.customId] }
        })
      );
    }

    dispatch(addBlockRedux(getResourceParam(block, "customId")));
  }
};

// TODO: Update this to IUpdateBlock which will include and make required the required fields
interface IUpdateBlockParams {
  data: Partial<IBlock>;
  block: IBlock;
}

const updateBlockMethods: IPipeline<
  IUpdateBlockParams,
  IUpdateBlockParams,
  INetResult,
  INetResult
> = {
  process({ params: params }) {
    const { data } = params;
    data.expectedEndAt = convertDateToTimestamp(data.expectedEndAt);
    return { ...params, data };
  },

  async net({ params }) {
    const { block, data } = params;
    return await netInterface("block.updateBlock", { block, data });
  },

  handleError: {
    // filterBaseNames: ["block"],
    stripBaseNames: ["data"]
  },

  redux({ state, dispatch, params }) {
    const { block, data } = params;
    dispatch(
      updateBlockRedux({
        id: block.customId,
        resource: data
      })
    );
  }
};

interface IToggleTaskParams {
  block: IBlock;
  user: IUser;
}

const toggleTaskMethods: IPipeline<
  IToggleTaskParams,
  IToggleTaskParams,
  INetResult,
  INetResult
> = {
  async net({ params }) {
    const { block } = params;
    return await netInterface("block.toggleTask", { block, data: true });
  },

  redux({ state, dispatch, params }) {
    const { block, user } = params;
    const collaboratorIndex = block.taskCollaborators.findIndex(
      c => c.userId === user.customId
    );

    const collaborator = block.taskCollaborators[collaboratorIndex];
    const updatedBlock = dotProp.set(
      block,
      `taskCollaborators.${collaboratorIndex}.completedAt`,
      collaborator.completedAt ? null : Date.now()
    );

    dispatch(updateBlockRedux(getResourceParam(updatedBlock, "customId")));
  }
};

interface IDeleteBlockParams {
  block: IBlock;
}

const deleteBlockMethods: IPipeline<
  IDeleteBlockParams,
  IDeleteBlockParams,
  INetResult,
  INetResult
> = {
  async net({ params }) {
    const { block } = params;
    return await netInterface("block.deleteBlock", { block });
  },

  redux({ state, dispatch, params }) {
    const { block } = params;
    dispatch(deleteBlockRedux(getResourceParam(block, "customId")));
  }
};

// TODO: Define collaborators type
// TODO: Create a package maybe called softkave-bridge that contains resuable bits between front and backend
interface IAddCollaboratorParams {
  requests: any[];
  block: IBlock;
  message?: string;
  expiresAt?: number | Date;
}

const addCollaboratorMethods: IPipeline<
  IAddCollaboratorParams,
  IAddCollaboratorParams,
  INetResult,
  INetResult
> = {
  process({ params }) {
    const { requests: collaborators, message, expiresAt } = params;
    const proccessedCollaborators = collaborators.map(request => {
      if (!request.message) {
        request.body = message;
      }

      if (!request.expiresAt) {
        request.expiresAt = expiresAt;
      } else if (request.expiresAt.valueOf) {
        request.expiresAt = convertDateToTimestamp(request.expiresAt);
      }

      request.customId = newId();
      request.statusHistory = [{ status: "pending", date: Date.now() }];
      return request;
    });

    return { ...params, requests: proccessedCollaborators };
  },

  async net({ params }) {
    const { block, requests: collaborators } = params;
    return await netInterface("block.addCollaborators", {
      block,
      collaborators
    });
  },

  redux({ state, dispatch, params }) {
    const { block, requests } = params;
    const requestIds = requests.map(request => request.customId);

    dispatch(
      bulkAddNotificationsRedux(getResourceParamArray(requests, "customId"))
    );
    dispatch(
      updateBlockRedux({
        id: block.customId,
        resource: { collaborationRequests: requestIds }
      })
    );
  }
};

interface IGetBlockChildrenParams {
  block: IBlock;
  types?: string[];
  isBacklog?: boolean;
  updateBlock: PipelineEntryFunc<IUpdateBlockParams>;
}

/**
 * TODO: Separate IBlock from INetBlock which is block returned from the server
 * because some fields are not present in it
 */
interface IGetBlockChildrenNetResult {
  blocks: IBlock[];
}

const getBlockChildrenMethods: IPipeline<
  IGetBlockChildrenParams,
  IGetBlockChildrenParams,
  IGetBlockChildrenNetResult,
  IGetBlockChildrenNetResult
> = {
  async net({ params }) {
    const { block, types, isBacklog } = params;
    return await netInterface("block.getBlockChildren", {
      block,
      types,
      isBacklog
    });
  },

  // TODO: think on having a postNet function

  redux({ state, dispatch, params, result }) {
    const { block, updateBlock } = params;
    const { blocks } = result;
    const children: any = {
      tasks: [],
      groups: [],
      projects: [],
      groupTaskContext: [],
      groupProjectContext: []
    };

    blocks.forEach(nextBlock => {
      const container = children[`${nextBlock.type}s`];
      container.push(nextBlock.customId);

      if (nextBlock.type === "group") {
        children.groupTaskContext.push(nextBlock.customId);
        children.groupProjectContext.push(nextBlock.customId);
      }
    });

    // tslint:disable-next-line: forin
    for (const key in children) {
      const typeContainer = children[key];

      if (
        !Array.isArray(block[key]) ||
        block[key].length !== typeContainer.length
      ) {
        // TODO: Think on: do we need to handle error here
        // const updateBlockResult = await updateBlock(block, block);
        // throwOnError(updateBlockResult);
        updateBlock({ block, data: children });
        dispatch(updateBlockRedux({ id: block.customId, resource: children }));
        break;
      }
    }

    dispatch(bulkAddBlocksRedux(getResourceParamArray(blocks, "customId")));
  }
};

interface IGetCollaboratorsParams {
  block: IBlock;
}

// TODO: Change collaborators type to appropriate type
interface IGetCollaboratorsNetResult {
  collaborators: IUser[];
}

const getCollaboratorsMethods: IPipeline<
  IGetCollaboratorsParams,
  IGetCollaboratorsParams,
  IGetCollaboratorsNetResult,
  IGetCollaboratorsNetResult
> = {
  async net({ params }) {
    const { block } = params;
    return await netInterface("block.getCollaborators", { block });
  },

  redux({ state, dispatch, params, result }) {
    const ids = result.collaborators.map(collaborator => collaborator.customId);
    dispatch(
      bulkAddUsersRedux(getResourceParamArray(result.collaborators, "customId"))
    );
    dispatch(
      updateBlockRedux({
        id: params.block.customId,
        resource: { collaborators: ids }
      })
    );
  }
};

interface IGetCollaborationRequestsParams {
  block: IBlock;
}

// TODO: Change requests type from any
interface IGetCollaborationRequestsNetResult {
  requests: any[];
}

const getCollaborationRequestsMethods: IPipeline<
  IGetCollaborationRequestsParams,
  IGetCollaborationRequestsParams,
  IGetCollaborationRequestsNetResult,
  IGetCollaborationRequestsNetResult
> = {
  async net({ params }) {
    const { block } = params;
    return await netInterface("block.getCollabRequests", { block });
  },

  redux({ state, dispatch, params, result }) {
    const ids = result.requests.map(request => request.customId);
    dispatch(
      bulkAddNotificationsRedux(
        getResourceParamArray(result.requests, "customId")
      )
    );
    dispatch(
      updateBlockRedux({
        id: params.block.customId,
        resource: { collaborationRequests: ids }
      })
    );
  }
};

interface IFetchRootDataNetResult {
  blocks: IBlock[];
}

const fetchRootDataMethods: IPipeline<
  null,
  null,
  IFetchRootDataNetResult,
  IFetchRootDataNetResult
> = {
  async net() {
    return await netInterface("block.getRoleBlocks");
  },

  redux({ state, dispatch, result }) {
    const { blocks } = result;
    let rootBlock: any = null;
    const orgs = {};
    blocks.forEach(blk => {
      if (blk.type === "root") {
        rootBlock = blk;
      } else if (blk.type === "org") {
        orgs[blk.customId] = blk;
      }
    });

    dispatch(bulkAddBlocksRedux(getResourceParamArray(blocks, "customId")));
  }
};

// TODO: Define dragInformation data type
interface ITransferBlockParams {
  draggedBlock: IBlock;
  sourceBlock: IBlock;
  destinationBlock: IBlock;
  groupContext?: string;
  dragInformation: any;
}

interface ITransferBlockProcessedParams extends ITransferBlockParams {
  draggedBlockPosition: number;
  dropPosition: number;
}

const transferBlockMethods: IPipeline<
  ITransferBlockParams,
  ITransferBlockProcessedParams,
  INetResult,
  INetResult
> = {
  process({ params }) {
    const {
      draggedBlock,
      sourceBlock,
      destinationBlock,
      dragInformation,
      groupContext
    } = params;
    const pluralizedType = `${draggedBlock.type}s`;
    return {
      draggedBlock,
      sourceBlock,
      destinationBlock,
      dragInformation,
      groupContext,
      draggedBlockPosition: getIndex(
        sourceBlock[pluralizedType],
        draggedBlock.customId
      ),
      dropPosition: dragInformation.destination.index
    };
  },

  async net({ params }) {
    const {
      draggedBlock,
      sourceBlock,
      destinationBlock,
      groupContext,
      dropPosition,
      draggedBlockPosition
    } = params;
    return await netInterface(
      "block.transferBlock",
      sourceBlock,
      draggedBlock,
      destinationBlock,
      dropPosition,
      draggedBlockPosition,
      draggedBlock.type,
      groupContext
    );
  },

  redux({ state, dispatch, params }) {
    const {
      draggedBlock,
      sourceBlock,
      destinationBlock,
      groupContext,
      dropPosition,
      draggedBlockPosition
    } = params;
    const pluralizedType = `${draggedBlock.type}s`;

    if (draggedBlock.type === "group") {
      if (groupContext) {
        const groupChildren = move(
          sourceBlock[groupContext],
          draggedBlock.customId,
          dropPosition
        );

        sourceBlock[groupContext] = groupChildren;
      } else {
        const groupTaskContext = `groupTaskContext`;
        const groupProjectContext = `groupProjectContext`;
        const groupTaskContextChildren = move(
          sourceBlock[groupTaskContext],
          draggedBlock.customId,
          dropPosition
        );

        const groupProjectContextChildren = move(
          sourceBlock[groupProjectContext],
          draggedBlock.customId,
          dropPosition
        );

        sourceBlock[groupTaskContext] = groupTaskContextChildren;
        sourceBlock[groupProjectContext] = groupProjectContextChildren;
      }

      const children = move(
        sourceBlock[pluralizedType],
        draggedBlock.customId,
        dropPosition
      );

      sourceBlock[pluralizedType] = children;
      dispatch(updateBlockRedux(getResourceParam(sourceBlock, "customId")));
    } else if (sourceBlock.customId === destinationBlock.customId) {
      const children = move(
        sourceBlock[pluralizedType],
        draggedBlock.customId,
        dropPosition
      );

      sourceBlock[pluralizedType] = children;
      dispatch(updateBlockRedux(getResourceParam(sourceBlock, "customId")));
    } else {
      sourceBlock[pluralizedType] = remove(
        sourceBlock[pluralizedType],
        draggedBlock.customId
      );

      destinationBlock[pluralizedType] = add(
        destinationBlock[pluralizedType],
        draggedBlock.customId,
        dropPosition
      );

      const draggedBlockParentUpdate = [...(destinationBlock.parents || [])];
      draggedBlockParentUpdate.push(destinationBlock.customId);
      draggedBlock.parents = draggedBlockParentUpdate;

      // clear children data so that they can be loaded with updated parents
      const draggedBlockChildrenTypes = getBlockValidChildrenTypes(
        draggedBlock
      );

      draggedBlockChildrenTypes.forEach(type => {
        draggedBlock[`${type}s`] = undefined;
      });

      dispatch(updateBlockRedux(getResourceParam(draggedBlock, "customId")));
      dispatch(updateBlockRedux(getResourceParam(sourceBlock, "customId")));
      dispatch(
        updateBlockRedux(getResourceParam(destinationBlock, "customId"))
      );
    }

    if (
      sourceBlock.customId === destinationBlock.customId &&
      dropPosition === draggedBlockPosition
    ) {
      return;
    }
  }
};

export interface IBlockMethods {
  onAdd: PipelineEntryFunc<IAddBlockParams>;
  onUpdate: PipelineEntryFunc<IUpdateBlockParams>;
  onToggle: PipelineEntryFunc<IToggleTaskParams>;
  onDelete: PipelineEntryFunc<IDeleteBlockParams>;
  onAddCollaborators: PipelineEntryFunc<IAddCollaboratorParams>;
  getBlockChildren: PipelineEntryFunc<IGetBlockChildrenParams>;
  getCollaborators: PipelineEntryFunc<IGetCollaboratorsParams>;
  getCollaborationRequests: PipelineEntryFunc<IGetCollaborationRequestsParams>;
  fetchRootData: PipelineEntryFunc<undefined>;
  onTransferBlock: PipelineEntryFunc<ITransferBlockParams>;
}

export interface IGetBlockMethodsParams {
  dispatch: Dispatch;

  // TODO: Define state's type
  state: any;
}

export function getBlockMethods(reduxParams): IBlockMethods {
  return {
    onAdd: makePipeline(addBlockMethods, reduxParams),
    onUpdate: makePipeline(updateBlockMethods, reduxParams),
    onToggle: makePipeline(toggleTaskMethods, reduxParams),
    onDelete: makePipeline(deleteBlockMethods, reduxParams),
    onAddCollaborators: makePipeline(addCollaboratorMethods, reduxParams),
    getBlockChildren: makePipeline(getBlockChildrenMethods, reduxParams),
    getCollaborators: makePipeline(getCollaboratorsMethods, reduxParams),
    getCollaborationRequests: makePipeline(
      getCollaborationRequestsMethods,
      reduxParams
    ),
    fetchRootData: makePipeline(fetchRootDataMethods, reduxParams),
    onTransferBlock: makePipeline(transferBlockMethods, reduxParams)
  };
}
