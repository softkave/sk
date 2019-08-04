import dotProp from "dot-prop-immutable";
import randomColor from "randomcolor";

import { IBlock } from "../../models/block/block";
import { getBlockValidChildrenTypes } from "../../models/block/utils";
import { IUser } from "../../models/user/user";
import netInterface from "../../net/index";
import { INetResult } from "../../net/query";
import {
  deleteDataByPath,
  mergeDataByPath,
  setDataByPath
} from "../../redux/actions/data";
import { makeMultiple } from "../../redux/actions/make";
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
      block.path = `${parent.path}.${block.type}.${block.customId}`;
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
    } else {
      block.path = `${block.type}.${block.customId}`;
    }

    if (block.type === "org") {
      block.collaborators = [user];
      block.path = `orgs.${block.customId}`;
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
    const actions: any[] = [];

    if (parent) {
      actions.push(setDataByPath(parent.path, parent));
    }

    if (block.type === "org") {
      actions.push(setDataByPath("user.user.orgs", [block.customId]));
    }

    actions.push(setDataByPath(block.path, block));
    dispatch(makeMultiple(actions));
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
    dispatch(mergeDataByPath(block.path, data));
  }
};

interface IToggleTaskParams {
  block: IBlock;
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

  redux({ state, dispatch, params, user }) {
    const { block } = params;
    const collaboratorIndex = block.taskCollaborators.findIndex(
      c => c.userId === user.customId
    );

    const collaborator = block.taskCollaborators[collaboratorIndex];
    const path = `${
      block.path
    }.taskCollaborators.${collaboratorIndex}.completedAt`;

    dispatch(setDataByPath(path, collaborator.completedAt ? null : Date.now()));
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
    dispatch(deleteDataByPath(block.path));
  }
};

// TODO: Define collaborators type
// TODO: Create a package maybe called softkave-bridge that contains resuable bits between front and backend
interface IAddCollaboratorParams {
  collaborators: any;
  message: string;
  expiresAt: number | Date;
  block: IBlock;
}

const addCollaboratorMethods: IPipeline<
  IAddCollaboratorParams,
  IAddCollaboratorParams,
  INetResult,
  INetResult
> = {
  process({ params }) {
    const { collaborators, message, expiresAt } = params;
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

    return { ...params, collaborators: proccessedCollaborators };
  },

  async net({ params }) {
    const { block, collaborators } = params;
    return await netInterface("block.addCollaborators", {
      block,
      collaborators
    });
  },

  redux({ state, dispatch, params }) {
    const { block, collaborators } = params;
    dispatch(
      mergeDataByPath(`${block.path}.collaborationRequests`, collaborators)
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
    const blockMappedToType = {};
    const childrenTypes = getBlockValidChildrenTypes(block);
    const children: any = {
      tasks: [],
      groups: [],
      projects: [],
      groupTaskContext: [],
      groupProjectContext: []
    };

    const groupTaskContext = "groupTaskContext";
    const groupProjectContext = "groupProjectContext";
    const prefill = [
      "tasks",
      "groups",
      "projects",
      groupTaskContext,
      groupProjectContext
    ];

    if (childrenTypes.length > 0) {
      childrenTypes.forEach(type => {
        blockMappedToType[type] = {};
      });
    }

    const existingChildrenIds = {
      tasks: {},
      groups: {},
      projects: {},
      groupTaskContext: {},
      groupProjectContext: {}
    };

    Object.keys(existingChildrenIds).forEach(key => {
      if (Array.isArray(block[key])) {
        block[key].forEach(id => {
          existingChildrenIds[key][id] = true;
        });
      }
    });

    blocks.forEach(next => {
      next.path = `${next.path}.${next.type}.${next.customId}`;
      const typeMap = blockMappedToType[next.type] || {};
      typeMap[next.customId] = next;
      blockMappedToType[next.type] = typeMap;

      if (next.type === "group") {
        if (!existingChildrenIds[groupTaskContext][next.customId]) {
          children[groupTaskContext].push(next.customId);
        }

        if (!existingChildrenIds[groupProjectContext][next.customId]) {
          children[groupProjectContext].push(next.customId);
        }
      }

      const pluralizedType = `${next.type}s`;

      if (!existingChildrenIds[pluralizedType][next.customId]) {
        children[pluralizedType].push(next.customId);
      }

      prefill.forEach(key => {
        if (!Array.isArray(next[key])) {
          next[key] = [];
        }
      });
    });

    let updateParentBlock = false;

    Object.keys(children).forEach(key => {
      if (!Array.isArray(block[key]) || children[key].length > 0) {
        updateParentBlock = true;
        block[key] = children[key];
      }
    });

    if (updateParentBlock) {
      updateBlock({ block, data: block });

      // TODO: Think on: do we need to handle error here
      // const updateBlockResult = await updateBlock(block, block);
      // throwOnError(updateBlockResult);
    }

    dispatch(mergeDataByPath(block.path, blockMappedToType));
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
    const { block } = params;
    dispatch(
      setDataByPath(`${block.path}.collaborators`, result.collaborators)
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
    const { block } = params;
    dispatch(
      setDataByPath(`${block.path}.collaborationRequests`, result.requests)
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
        rootBlock.path = `rootBlock`;
      } else if (blk.type === "org") {
        orgs[blk.customId] = blk;
        blk.path = `orgs.${blk.customId}`;
      }
    });

    const actions = [
      mergeDataByPath(rootBlock.path, rootBlock),
      mergeDataByPath("orgs", orgs)
    ];

    dispatch(makeMultiple(actions));
  }
};

// TODO: Define dragInformation data type
interface ITransferBlockParams {
  draggedBlock: IBlock;
  sourceBlock: IBlock;
  destinationBlock: IBlock;
  dropPosition: number;
  groupContext?: string;
  dragInformation: any;
}

interface ITransferBlockProcessedParams extends ITransferBlockParams {
  draggedBlockPosition: number;
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
    const actions: any[] = [];
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
      actions.push(setDataByPath(sourceBlock.path, sourceBlock));
    } else if (sourceBlock.customId === destinationBlock.customId) {
      const children = move(
        sourceBlock[pluralizedType],
        draggedBlock.customId,
        dropPosition
      );

      sourceBlock[pluralizedType] = children;
      actions.push(setDataByPath(sourceBlock.path, sourceBlock));
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
        draggedBlock[type] = undefined;
      });

      const draggedBlockType = draggedBlock.type;
      const draggedBlockPath = `${draggedBlockType}.${draggedBlock.customId}`;

      const updatedSourceBlock = dotProp.delete(sourceBlock, draggedBlockPath);
      const updatedDestBlock = dotProp.set(
        destinationBlock,
        draggedBlockPath,
        draggedBlock
      );

      actions.push(setDataByPath(draggedBlock.path, draggedBlock));
      actions.push(setDataByPath(updatedSourceBlock.path, updatedSourceBlock));
      actions.push(setDataByPath(updatedDestBlock.path, updatedDestBlock));
    }

    if (
      sourceBlock.customId === destinationBlock.customId &&
      dropPosition === draggedBlockPosition
    ) {
      return;
    }

    dispatch(makeMultiple(actions));
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
