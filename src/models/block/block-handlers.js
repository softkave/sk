import {
  mergeDataByPath,
  deleteDataByPath,
  setDataByPath
} from "../../redux/actions/data";
import netInterface from "../../net/index";
import randomColor from "randomcolor";
import { generatePermission } from "./permission";
import { getBlockActionsFromParent } from "./actions";

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

    onAddCollaborators(block, { collaborators, message, expiresAt }) {
      collaborators = collaborators.map(c => {
        if (!c.message) {
          c.message = message;
        }

        if (!c.expiresAt) {
          c.expiresAt = expiresAt;
        }

        c.id = getId();
        c.statusHistory = [{ status: "pending", date: Date.now() }];
        return c;
      });

      dispatch(
        mergeDataByPath(`${block.path}.collaborationRequests`, collaborators)
      );

      netInterface("block.addCollaborators", { collaborators });
    },

    onUpdateCollaborator(block, collaborator, data) {
      let updatedRole = data.role;
      delete data.role;
      collaborator = { ...collaborator, ...data };
      let orgId =
        Array.isArray(block.parents) && block.parents.length > 1
          ? block.parents[0]
          : block.id;

      if (updatedRole) {
        let blockRole = block.roles.find(role => {
          return role.role === updatedRole;
        });

        if (blockRole) {
          updatedRole = generatePermission(block, blockRole, user);
          let existingRoleIndex = collaborator.permissions.findIndex(role => {
            return role.blockId === block.id;
          });

          if (existingRoleIndex) {
            collaborator.permissions.splice(existingRoleIndex, 1, updatedRole);
          } else {
            collaborator.permissions.push(updatedRole);
          }
        }
      }

      dispatch(setDataByPath(`orgs.${orgId}.collaborators`));
    }
  };
}
