import {
  mergeDataByPath,
  deleteDataByPath,
  setDataByPath
} from "../../redux/actions/data";
import netInterface from "../../net/index";
import randomColor from "randomcolor";
import { permittedChildrenTypes } from "./block-utils";

const getId = require("uuid/v4");
// const getId = require("nanoid");

export function makeBlockHandlers({ dispatch, user }) {
  function prepareBlockFromEditData(block) {
    if (block.expectedEndAt) {
      block.expectedEndAt = block.expectedEndAt.valueOf();
    }

    return block;
  }

  return {
    async onAdd(block, parent) {
      block.createdAt = Date.now();
      block.createdBy = user.customId;
      block.customId = getId();
      block.color = randomColor();

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

      block = prepareBlockFromEditData(block);

      if (block.type === "org") {
        block.collaborators = [user];
        block.path = `orgs.${block.customId}`;
        dispatch(setDataByPath("user.user.orgs", [block.customId]));
      } else if (block.type === "task") {
        if (!block.taskCollaborators) {
          block.taskCollaborators = [];
        }
      }

      if (permittedChildrenTypes[block.type]) {
        permittedChildrenTypes[block.type].forEach(type => {
          block[type] = {};
        });
      }

      dispatch(setDataByPath(block.path, block));
      netInterface("block.addBlock", block);
    },

    onUpdate(block, data) {
      data = prepareBlockFromEditData(data);
      dispatch(mergeDataByPath(block.path, data));
      netInterface("block.updateBlock", block, data);
    },

    onToggle(block) {
      const collaboratorIndex = block.taskCollaborators.findIndex(
        c => c.userId === user.customId
      );

      const collaborator = block.taskCollaborators[collaboratorIndex];
      const path = `${
        block.path
      }.taskCollaborators.${collaboratorIndex}.completedAt`;

      dispatch(
        setDataByPath(path, collaborator.completedAt ? null : Date.now())
      );

      netInterface("block.toggleTask", block, true);
    },

    onDelete(block) {
      dispatch(deleteDataByPath(block.path));
      netInterface("block.deleteBlock", block);
    },

    onAddCollaborators(block, { collaborators, message, expiresAt }) {
      collaborators = collaborators.map(c => {
        if (!c.message) {
          c.message = message;
        }

        if (!c.expiresAt) {
          c.expiresAt = expiresAt;
        } else if (c.expiresAt.valueOf) {
          c.expiresAt = c.expiresAt.valueOf();
        }

        c.customId = getId();
        c.statusHistory = [{ status: "pending", date: Date.now() }];
        return c;
      });

      dispatch(
        mergeDataByPath(`${block.path}.collaborationRequests`, collaborators)
      );

      netInterface(
        "block.addCollaborators",
        block,
        collaborators,
        message,
        expiresAt
      );
    },

    onUpdateCollaborator(block, collaborator, data) {
      collaborator = { ...collaborator, ...data };
      let orgId =
        Array.isArray(block.parents) && block.parents.length > 1
          ? block.parents[0]
          : block.customId;

      dispatch(setDataByPath(`orgs.${orgId}.collaborators`));
    },

    async getBlockChildren(block) {
      const { blocks } = await netInterface("block.getBlockChildren", block);
      let blockMappedToType = {};

      if (permittedChildrenTypes[block.type]) {
        permittedChildrenTypes[block.type].forEach(type => {
          blockMappedToType[type] = {};
        });
      }

      blocks.forEach(blk => {
        blk.path = `${block.path}.${blk.type}.${blk.customId}`;
        let typeMap = blockMappedToType[blk.type] || {};
        typeMap[blk.customId] = blk;
        blockMappedToType[blk.type] = typeMap;
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
    }
  };
}
