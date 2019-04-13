import {
  mergeDataByPath,
  deleteDataByPath,
  setDataByPath
} from "../../redux/actions/data";
import netInterface from "../../net/index";
import randomColor from "randomcolor";
import { generatePermission } from "../models/user/permission";
import { getBlockActionsFromParent } from "../models/actions";

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
      block.createdBy = user.id;
      block.id = getId();
      block.color = randomColor();
      if (parent) {
        block.path = `${parent.path}.${block.type}s.${block.id}`;
        block.parents = [];
        if (parent.parents) {
          block.parents = block.parents.concat(parent.parents);
        }

        block.parents.push(parent.id);
        block.owner = parent.owner;

        if (!block.acl) {
          block.acl = getBlockActionsFromParent(block, parent);
        }
      } else {
        block.path = `${block.type}s.${block.id}`;
        block.owner = block.id;
      }

      block = prepareBlockFromEditData(block);
      if (block.type === "org") {
        block.collaborators = [user];
        let userPermissions = [...user.permissions];
        userPermissions.push(
          generatePermission(block, block.roles[block.roles.length - 1])
        );

        dispatch(setDataByPath("user.user.permissions", userPermissions));
      } else if (block.type === "task") {
        if (!block.collaborators) {
          block.collaborators = [];
        }
      }

      dispatch(setDataByPath(block.path, block));
      netInterface("block.createBlock", block);
    },

    onUpdate(block, data) {
      data = prepareBlockFromEditData(data);
      dispatch(mergeDataByPath(block.path, data));
      netInterface("block.updateBlock", block, data);
    },

    onToggle(block) {
      const collaboratorIndex = block.collaborators.findIndex(
        c => c.userId === user.id
      );

      const collaborator = block.collaborators[collaboratorIndex];
      const path = `${
        block.path
      }.collaborators.${collaboratorIndex}.completedAt`;

      dispatch(
        setDataByPath(path, collaborator.completedAt ? null : Date.now())
      );

      netInterface("block.toggleTask", { block });
    },

    onDelete(block) {
      dispatch(deleteDataByPath(block.path));
      netInterface("block.deleteBlock", block);
    },

    onAddCollaborators(block, collaborators) {
      dispatch(
        mergeDataByPath(`${block.path}.collaborationRequests`, collaborators)
      );
    }
  };
}
