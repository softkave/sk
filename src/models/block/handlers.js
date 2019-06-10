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

function convertDateToTimestamp(date) {
  if (date && date.valueOf) {
    return date.valueOf();
  }
}

export function makeBlockHandlers({ dispatch, user }) {
  return {
    async onAdd(block, parent) {
      block.createdAt = Date.now();
      block.createdBy = user.customId;
      block.customId = newId();
      block.color = randomColor();
      block.expectedEndAt = convertDateToTimestamp(block.expectedEndAt);
      block.position = 0;
      block.positionTimestamp = Date.now();

      if (parent) {
        block.path = `${parent.path}.${block.type}.${block.customId}`;
        block.parents = [];

        if (parent.parents) {
          block.parents = block.parents.concat(parent.parents);
        }

        block.parents.push(parent.customId);

        // const parentChildrenLength = parent.sorted[type].length;
        // block.position = parentChildrenLength;
        // block.positionTimestamp = Date.now();
        // parent.sorted[type].push(block.customId);
        // actions.push(setDataByPath(parent.customId, parent));
      } else {
        block.path = `${block.type}.${block.customId}`;
      }

      const actions = [];
      const childrenTypes = getBlockValidChildrenTypes(block);

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
          block[type] = {};
        });
      }

      actions.push(setDataByPath(block.path, block));
      await netInterface("block.addBlock", block);
      dispatch(makeMultiple(actions));
    },

    async onUpdate(block, data) {
      data.expectedEndAt = convertDateToTimestamp(data.expectedEndAt);
      await netInterface("block.updateBlock", block, data);
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

      await netInterface("block.toggleTask", block, true);
      dispatch(
        setDataByPath(path, collaborator.completedAt ? null : Date.now())
      );
    },

    async onDelete(block) {
      await netInterface("block.deleteBlock", block);
      dispatch(deleteDataByPath(block.path));
    },

    async onAddCollaborators(block, { collaborators, message, expiresAt }) {
      collaborators = collaborators.map(c => {
        if (!c.message) {
          c.message = message;
        }

        if (!c.expiresAt) {
          c.expiresAt = expiresAt;
        } else if (c.expiresAt.valueOf) {
          c.expiresAt = convertDateToTimestamp(c.expiresAt);
        }

        c.customId = newId();
        c.statusHistory = [{ status: "pending", date: Date.now() }];
        return c;
      });

      await netInterface(
        "block.addCollaborators",
        block,
        collaborators,
        message,
        expiresAt
      );

      dispatch(
        mergeDataByPath(`${block.path}.collaborationRequests`, collaborators)
      );
    },

    async onUpdateCollaborator(block, collaborator, data) {
      // TODO: implement
    },

    async getBlockChildren(block) {
      const { blocks } = await netInterface("block.getBlockChildren", block);
      let blockMappedToType = {};
      const childrenTypes = getBlockValidChildrenTypes(block);
      // let hasChildrenArray = false;

      if (childrenTypes.length > 0) {
        childrenTypes.forEach(type => {
          blockMappedToType[type] = {};
        });
      }

      // if (!Array.isArray(block.children)) {
      //   block.children = [];
      // } else {
      //   hasChildrenArray = true;
      // }

      blocks.forEach(data => {
        data.path = `${block.path}.${data.type}.${data.customId}`;
        let typeMap = blockMappedToType[data.type] || {};
        typeMap[data.customId] = data;
        blockMappedToType[data.type] = typeMap;

        if (!data.position) {
          data.position = 0;
        }

        if (!data.positionTimestamp) {
          data.positionTimestamp = Date.now();
        }

        // if (!hasChildrenArray) {
        //   block.children.push(data.customId);
        // }
      });

      dispatch(mergeDataByPath(block.path, blockMappedToType));

      // if (!hasChildrenArray) {
      //   this.onUpdate(block, block);
      // }
    },

    async getCollaborators(block) {
      const { collaborators } = await netInterface(
        "block.getCollaborators",
        block
      );

      dispatch(mergeDataByPath(`${block.path}.collaborators`, collaborators));
    },

    async getCollaborationRequests(block) {
      const { requests } = await netInterface("block.getCollabRequests", block);

      dispatch(
        mergeDataByPath(`${block.path}.collaborationRequests`, requests)
      );
    },

    async fetchRootData() {
      const { blocks } = await netInterface("block.getRoleBlocks");

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

    async onDragAndDropBlock(
      draggedBlock,
      sourceBlock,
      destinationBlock,
      dragInformation
    ) {
      const actions = [];
      const dropPosition = dragInformation.destination.index;
      console.log({
        draggedBlock,
        sourceBlock,
        destinationBlock,
        dragInformation
      });

      // function updatePosition(blocks, draggedBlock, dropPosition, increment) {
      //   const updatedBlocks = {};

      //   for (const id in blocks) {
      //     let block = blocks[id];

      //     if (increment && id === draggedBlock.customId) {
      //       block = dotProp.set(block, "position", dropPosition);
      //     } else if (block.position >= dropPosition) {
      //       const positionInfo = ``;
      //       block = dotProp.set(
      //         block,
      //         "position",
      //         increment ? block.position + 1 : block.position - 1
      //       );
      //     }

      //     updatedBlocks[id] = block;
      //   }

      //   return updatedBlocks;
      // }

      if (
        draggedBlock.type === "GROUP" ||
        sourceBlock.customId === destinationBlock.customId
      ) {
        // const positionInfo = `${dropPosition}-${Date.now()}`;
        // draggedBlock = dotProp.set(draggedBlock, "position", positionInfo);
        // draggedBlock = dotProp.merge(draggedBlock, "", {
        //   position: dropPosition,
        //   positionTimestamp: Date.now()
        // });

        draggedBlock = {
          ...draggedBlock,
          position: dropPosition,
          positionTimestamp: Date.now()
        };

        // sourceBlock = dotProp.set(
        //   sourceBlock,
        //   "group",
        //   updatePosition(
        //     sourceBlock.group,
        //     draggedBlock,
        //     dragInformation.destination.index,
        //     true
        //   )
        // );

        // actions.push(setDataByPath(sourceBlock.path, sourceBlock));
        actions.push(setDataByPath(draggedBlock.path, draggedBlock));

        // const children = [...sourceBlock.children];
        // const draggedBlockIndex = children.indexOf(draggedBlock.customId);
        // children.splice(draggedBlockIndex, 1);
        // children.splice(dropPosition, 0, draggedBlock.customId);
        // sourceBlock = dotProp.set(sourceBlock, "children", children);
        // actions.push(setDataByPath(sourceBlock.path, sourceBlock));
      }
      // else if (sourceBlock.customId === destinationBlock.customId) {
      //   const draggedBlockType = draggedBlock.type;
      //   const update = updatePosition(
      //     sourceBlock[draggedBlockType],
      //     draggedBlock,
      //     dragInformation.destination.index,
      //     true
      //   );

      //   sourceBlock = dotProp.set(sourceBlock, draggedBlockType, update);
      //   actions.push(setDataByPath(sourceBlock.path, sourceBlock));
      // }
      else {
        // const positionInfo = `${dropPosition}-${Date.now()}`;
        // draggedBlock = dotProp.merge(draggedBlock, "", {
        //   position: dropPosition,
        //   positionTimestamp: Date.now()
        // });

        draggedBlock = {
          ...draggedBlock,
          position: dropPosition,
          positionTimestamp: Date.now()
        };

        let parentIds = draggedBlock.parents;
        const sourceBlockIdIndex = parentIds.indexOf(sourceBlock.customId);
        parentIds = dotProp.set(
          parentIds,
          sourceBlockIdIndex,
          destinationBlock.customId
        );

        draggedBlock.parents = parentIds;
        // draggedBlock = dotProp.set(draggedBlock, "parents", parentIds);

        const draggedBlockType = draggedBlock.type;
        const draggedBlockPath = `${draggedBlockType}.${draggedBlock.customId}`;

        sourceBlock = dotProp.delete(sourceBlock, draggedBlockPath);
        destinationBlock = dotProp.set(
          destinationBlock,
          draggedBlockPath,
          draggedBlock
        );

        // const sourceBlockChildren = [...sourceBlock.children];
        // const destinationBlockChildren = [...destinationBlock.children];
        // const draggedBlockIndex = sourceBlockChildren.indexOf(draggedBlock.customId);
        // sourceBlockChildren.splice(draggedBlockIndex, 1);
        // destinationBlockChildren.splice(dropPosition, 0, draggedBlock.customId);
        // sourceBlock.children = sourceBlockChildren;
        // destinationBlock.children = destinationBlockChildren;
        // actions.push(setDataByPath(sourceBlock.path, sourceBlock));

        // const sourceBlockUpdate = updatePosition(
        //   sourceBlock[draggedBlockType],
        //   draggedBlock,
        //   dragInformation.destination.index,
        //   false
        // );

        // const destinationBlockUpdate = updatePosition(
        //   destinationBlock[draggedBlockType],
        //   draggedBlock,
        //   dragInformation.destination.index,
        //   true
        // );

        // sourceBlock[draggedBlockType] = sourceBlockUpdate;
        // destinationBlock[draggedBlockType] = destinationBlockUpdate;
        actions.push(setDataByPath(draggedBlock.path, draggedBlock));
        actions.push(setDataByPath(sourceBlock.path, sourceBlock));
        actions.push(setDataByPath(destinationBlock.path, destinationBlock));
      }

      dispatch(makeMultiple(actions));
      // await netInterface("block.updateBlock", draggedBlock, draggedBlock);
      netInterface("block.updateBlock", draggedBlock, draggedBlock);
    }
  };
}
