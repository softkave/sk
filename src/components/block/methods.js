import dotProp from "dot-prop-immutable";
import {
  mergeDataByPath,
  deleteDataByPath,
  setDataByPath
} from "../../redux/actions/data";
import netInterface from "../../net/index";
import randomColor from "randomcolor";
import { makeMultiple } from "../../redux/actions/make";
import { newId } from "../../utils/utils";
import {
  stripFieldsFromError,
  filterErrorByBaseName
} from "../../components/FOR";
import { getBlockValidChildrenTypes } from "../../models/block/utils";

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

function throwOnError(result, filterBaseNames, stripBaseNames) {
  if (result && result.errors) {
    if (filterBaseNames) {
      result.errors = filterErrorByBaseName(
        result.errors,
        filterErrorByBaseName
      );
    }

    if (stripBaseNames) {
      result.errors = stripFieldsFromError(result.errors, stripBaseNames);
    }

    throw result.errors;
  }

  return result;
}

const addBlockMethods = {
  process({ block, parent, user }) {
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

    return { parent, block };
  },

  async net({ block }) {
    return await netInterface("block.addBlock", { block });
  },

  handleError(result) {
    throwOnError(result, null, ["block"]);
  },

  redux({ state, dispatch, block, parent }) {
    const actions = [];

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

const updateBlockMethods = {
  process({ block }) {
    block.expectedEndAt = convertDateToTimestamp(block.expectedEndAt);
    return block;
  },

  async net({ block, data }) {
    return await netInterface("block.updateBlock", { block, data });
  },

  handleError(result) {
    throwOnError(result, ["block"], ["data"]);
  },

  redux({ state, dispatch, block, data }) {
    dispatch(mergeDataByPath(block.path, data));
  }
};

const toggleTaskMethods = {
  process({ block }) {
    return block;
  },

  async net({ block }) {
    return await netInterface("block.toggleTask", { block, data: true });
  },

  handleError(result) {
    throwOnError(result);
  },

  redux({ state, dispatch, block, user }) {
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

const deleteBlockMethods = {
  process({ block }) {
    return block;
  },

  async net({ block }) {
    return await netInterface("block.deleteBlock", { block });
  },

  handleError(result) {
    throwOnError(result);
  },

  redux({ state, dispatch, block }) {
    dispatch(deleteDataByPath(block.path));
  }
};

const addCollaboratorMethods = {
  process({ collaborators, message, expiresAt }) {
    return collaborators.map(request => {
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
  },

  async net({ block, collaborators }) {
    return await netInterface("block.addCollaborators", {
      block,
      collaborators
    });
  },

  handleError(result) {
    throwOnError(result);
  },

  redux({ state, dispatch, block, collaborators }) {
    dispatch(
      mergeDataByPath(`${block.path}.collaborationRequests`, collaborators)
    );
  }
};

const getBlockChildrenMethods = {
  process({ block }) {
    return block;
  },

  async net({ block, types, isBacklog }) {
    return await netInterface("block.getBlockChildren", {
      block,
      types,
      isBacklog
    });
  },

  handleError(result) {
    throwOnError(result);
  },

  // TODO: think on having a postNet function

  redux({ state, dispatch, block, blocks, updateBlock }) {
    let blockMappedToType = {};
    const childrenTypes = getBlockValidChildrenTypes(block);
    let children = {
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

    blocks.forEach(data => {
      data.path = `${block.path}.${data.type}.${data.customId}`;
      let typeMap = blockMappedToType[data.type] || {};
      typeMap[data.customId] = data;
      blockMappedToType[data.type] = typeMap;

      if (data.type === "group") {
        if (!existingChildrenIds[groupTaskContext][data.customId]) {
          children[groupTaskContext].push(data.customId);
        }

        if (!existingChildrenIds[groupProjectContext][data.customId]) {
          children[groupProjectContext].push(data.customId);
        }
      }

      const pluralizedType = `${data.type}s`;

      if (!existingChildrenIds[pluralizedType][data.customId]) {
        children[pluralizedType].push(data.customId);
      }

      prefill.forEach(key => {
        if (!Array.isArray(data[key])) {
          data.key = [];
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
      updateBlock(block, block);

      // TODO: Think on: do we need to handle error here
      // const updateBlockResult = await updateBlock(block, block);
      // throwOnError(updateBlockResult);
    }

    dispatch(mergeDataByPath(block.path, blockMappedToType));
  }
};

const getCollaboratorsMethods = {
  process({ block }) {
    return block;
  },

  async net({ block }) {
    return await netInterface("block.getCollaborators", { block });
  },

  handleError(result) {
    throwOnError(result);
  },

  redux({ state, dispatch, block, collaborators }) {
    dispatch(setDataByPath(`${block.path}.collaborators`, collaborators));
  }
};

const getCollaborationRequestsMethods = {
  process({ block }) {
    return block;
  },

  async net({ block }) {
    return await netInterface("block.getCollabRequests", { block });
  },

  handleError(result) {
    throwOnError(result);
  },

  redux({ state, dispatch, block, requests }) {
    dispatch(setDataByPath(`${block.path}.collaborationRequests`, requests));
  }
};

const fetchRootDataMethods = {
  process({ block }) {
    return block;
  },

  async net() {
    return await netInterface("block.getRoleBlocks");
  },

  handleError(result) {
    throwOnError(result);
  },

  redux({ state, dispatch, blocks }) {
    let rootBlock = null;
    let orgs = {};
    blocks.forEach(blk => {
      if (blk.type === "root") {
        rootBlock = blk;
        rootBlock.path = `rootBlock`;
      } else if (blk.type === "org") {
        orgs[blk.customId] = blk;
        blk.path = `orgs.${blk.customId}`;
      }
    });

    let actions = [
      mergeDataByPath(rootBlock.path, rootBlock),
      mergeDataByPath("orgs", orgs)
    ];

    dispatch(makeMultiple(actions));
  }
};

const transferBlockMethods = {
  process({
    draggedBlock,
    sourceBlock,
    destinationBlock,
    dragInformation,
    groupContext
  }) {
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

  async net({
    draggedBlock,
    sourceBlock,
    destinationBlock,
    groupContext,
    dropPosition,
    draggedBlockPosition
  }) {
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

  handleError(result) {
    throwOnError(result);
  },

  redux({
    state,
    dispatch,
    draggedBlock,
    sourceBlock,
    destinationBlock,
    groupContext,
    dropPosition,
    draggedBlockPosition
  }) {
    const actions = [];
    const pluralizedType = `${draggedBlock.type}s`;

    if (draggedBlock.type === "group") {
      if (groupContext) {
        const children = move(
          sourceBlock[groupContext],
          draggedBlock.customId,
          dropPosition
        );

        sourceBlock[groupContext] = children;
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

      sourceBlock = dotProp.delete(sourceBlock, draggedBlockPath);
      destinationBlock = dotProp.set(
        destinationBlock,
        draggedBlockPath,
        draggedBlock
      );

      actions.push(setDataByPath(draggedBlock.path, draggedBlock));
      actions.push(setDataByPath(sourceBlock.path, sourceBlock));
      actions.push(setDataByPath(destinationBlock.path, destinationBlock));
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

function makeField(methods, initialParams) {
  return async function(params) {
    return main(methods, { ...initialParams, params });
  };
}

async function main(methods, params) {
  let processedData = methods.process(params);
  let next = { ...params, ...processedData };
  let result = await methods.net(next);
  result = methods.handleError(result);
  next = { ...next, ...result };
  methods.redux(next);
}

export function getBlockMethods(reduxParams) {
  return {
    onAdd: makeField(addBlockMethods, reduxParams),
    onUpdate: makeField(updateBlockMethods, reduxParams),
    onToggle: makeField(toggleTaskMethods, reduxParams),
    onDelete: makeField(deleteBlockMethods, reduxParams),
    onAddCollaborators: makeField(addCollaboratorMethods, reduxParams),
    getBlockChildren: makeField(getBlockChildrenMethods, reduxParams),
    getCollaborators: makeField(getCollaboratorsMethods, reduxParams),
    getCollaborationRequests: makeField(
      getCollaborationRequestsMethods,
      reduxParams
    ),
    fetchRootData: makeField(fetchRootDataMethods, reduxParams),
    onTransferBlock: makeField(transferBlockMethods, reduxParams)
  };
}
