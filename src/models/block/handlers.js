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

      if (parent) {
        block.path = `${parent.path}.${block.type}.${block.customId}`;
        block.parents = [];

        if (parent.parents) {
          block.parents = block.parents.concat(parent.parents);
        }

        block.parents.push(parent.customId);
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

      if (childrenTypes.length > 0) {
        childrenTypes.forEach(type => {
          blockMappedToType[type] = {};
        });
      }

      blocks.forEach(data => {
        data.path = `${block.path}.${data.type}.${data.customId}`;
        let typeMap = blockMappedToType[data.type] || {};
        typeMap[data.customId] = data;
        blockMappedToType[data.type] = typeMap;
      });

      dispatch(mergeDataByPath(block.path, blockMappedToType));
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
    }
  };
}
