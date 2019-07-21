import dotProp from "dot-prop-immutable";
import {
  mergeDataByPath,
  deleteDataByPath,
  setDataByPath
} from "../../redux/actions/data";
import netInterface from "../../net/index";
import randomColor from "randomcolor";
import { getBlockValidChildrenTypes } from "./utils";
import { makeMultiple } from "../../redux/actions/make";
import { newId } from "../../utils/utils";
import {
  stripFieldsFromError,
  filterErrorByBaseName
} from "../../components/FOR";

function convertDateToTimestamp(date) {
  if (date && date.valueOf) {
    return date.valueOf();
  }
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

export function makeBlockHandlers({ dispatch, user }) {
  return {
    async onAdd(block, parent) {
      block.createdAt = Date.now();
      block.createdBy = user.customId;
      block.customId = newId();
      block.color = randomColor();
      block.expectedEndAt = convertDateToTimestamp(block.expectedEndAt);
      block.groupTaskContext = [];
      block.groupProjectContext = [];

      const actions = [];
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

        actions.push(setDataByPath(parent.path, parent));
      } else {
        block.path = `${block.type}.${block.customId}`;
      }

      if (block.type === "org") {
        block.collaborators = [user];
        block.path = `orgs.${block.customId}`;
        actions.push(setDataByPath("user.user.orgs", [block.customId]));
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

      actions.push(setDataByPath(block.path, block));

      const result = await netInterface("block.addBlock", block);
      throwOnError(result, null, ["block"]);
      dispatch(makeMultiple(actions));
    },

    async onUpdate(block, data) {
      data.expectedEndAt = convertDateToTimestamp(data.expectedEndAt);
      const result = await netInterface("block.updateBlock", block, data);
      throwOnError(result, ["block"], ["data"]);
      dispatch(mergeDataByPath(block.path, data));
    },

    async onToggle(block) {
      const collaboratorIndex = block.taskCollaborators.findIndex(
        c => c.userId === user.customId
      );

      const collaborator = block.taskCollaborators[collaboratorIndex];
      const path = `${
        block.path
      }.taskCollaborators.${collaboratorIndex}.completedAt`;

      const result = await netInterface("block.toggleTask", block, true);
      throwOnError(result);
      dispatch(
        setDataByPath(path, collaborator.completedAt ? null : Date.now())
      );
    },

    async onDelete(block) {
      const result = await netInterface("block.deleteBlock", block);
      throwOnError(result);
      dispatch(deleteDataByPath(block.path));
    },

    async onAddCollaborators(block, { collaborators, body, expiresAt }) {
      collaborators = collaborators.map(request => {
        if (!request.body) {
          request.body = body;
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

      const result = await netInterface(
        "block.addCollaborators",
        block,
        collaborators,
        body,
        expiresAt
      );

      throwOnError(result);
      dispatch(
        mergeDataByPath(`${block.path}.collaborationRequests`, collaborators)
      );
    },

    async getBlockChildren(block) {
      const result = await netInterface("block.getBlockChildren", block);

      throwOnError(result);

      const { blocks } = result;
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
        const updateBlockResult = await this.onUpdate(block, block);
        throwOnError(updateBlockResult);
      }

      dispatch(mergeDataByPath(block.path, blockMappedToType));
    },

    async getCollaborators(block) {
      const result = await netInterface("block.getCollaborators", block);

      throwOnError(result);

      const { collaborators } = result;
      dispatch(setDataByPath(`${block.path}.collaborators`, collaborators));
    },

    async getCollaborationRequests(block) {
      const result = await netInterface("block.getCollabRequests", block);
      throwOnError(result);

      const { requests } = result;
      dispatch(setDataByPath(`${block.path}.collaborationRequests`, requests));
    },

    async fetchRootData() {
      const result = await netInterface("block.getRoleBlocks");
      throwOnError(result);

      const { blocks } = result;
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
    },

    async onTransferBlock(
      draggedBlock,
      sourceBlock,
      destinationBlock,
      dragInformation,
      groupContext
    ) {
      function move(list, id, dropPosition) {
        const idIndex = list.indexOf(id);
        list = [...list];
        list.splice(idIndex, 1);
        list.splice(dropPosition, 0, id);
        return list;
      }

      // function update(list, id, updateId) {
      //   const idIndex = list.indexOf(id);
      // list = [...list];
      //   list[idIndex] = updateId;
      //   return list;
      // }

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

      const actions = [];
      const dropPosition = dragInformation.destination.index;
      const pluralizedType = `${draggedBlock.type}s`;
      let draggedBlockPosition = getIndex(
        sourceBlock[pluralizedType],
        draggedBlock.customId
      );

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

      // dispatch(makeMultiple(actions));
      const result = await netInterface(
        "block.transferBlock",
        sourceBlock,
        draggedBlock,
        destinationBlock,
        dropPosition,
        draggedBlockPosition,
        draggedBlock.type,
        groupContext
      );

      throwOnError(result);
      dispatch(makeMultiple(actions));
    }
  };
}
