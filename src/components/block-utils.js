import get from "lodash/get";
import {
  mergeDataByPath,
  deleteDataByPath,
  setDataByPath
} from "../redux/actions/data";
import netInterface from "../net";
import randomColor from "randomcolor";
import { generatePermission } from "../models/user/permission";
import {
  projectActions,
  groupActions,
  taskActions,
  orgActions
} from "../models/actions";

const getId = require("uuid/v4");
// const getId = require("nanoid");

export function getBlockParent(block, state) {
  return get(
    state,
    block.path
      .split(".")
      .slice(0, -2)
      .join(".")
  );
}

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
          let typeActions =
            block.type === "project"
              ? projectActions
              : block.type === "group"
              ? groupActions
              : block.type === "task"
              ? taskActions
              : orgActions;
          let actions = typeActions.reduce((actions, item) => {
            actions[item.action] = true;
            return actions;
          }, {});

          block.acl = parent.acl.filter(item => {
            return actions[item.action];
          });
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

export function sortBlocks({
  blocks,
  rootBlockId,
  replaceWithPath,
  standingOrgs
}) {
  let temp = {};
  let orgs = {};
  let assignedTasks = {};
  //let blocksMap = {};
  let rootBlock = null;
  const childrenFields = ["tasks", "groups", "projects"];

  function addChildrenFields(block) {
    childrenFields.forEach(field => {
      if (block.type !== field && !block[field]) {
        block[field] = {};
      }
    });

    return block;
  }

  blocks.forEach(block => {
    //blocksMap[block.id] = block;
    if (block.type !== "task") {
      let blockTemp = temp[block.id];
      block = addChildrenFields(block);
      if (blockTemp) {
        block = { ...block, ...blockTemp };
        temp[block.id] = block;
      } else {
        temp[block.id] = block;
      }
    }

    if (block.parents && block.parents.length > 0) {
      if (block.parents[0] !== rootBlockId) {
        if (standingOrgs) {
          let keep = standingOrgs;
          block.parents.some(parentId => {
            if (keep) {
              keep = keep[parentId];
            }

            return true;
          });

          if (keep && keep.id === block.id) {
            assignedTasks[block.id] = keep.path;
          }
        } else {
          block.path = `assignedTasks.${block.id}`;
          assignedTasks[block.id] = block;
        }

        return;
      }

      const immediateParentId = block.parents[block.parents.length - 1];
      let hold = temp[immediateParentId];
      if (!hold) {
        temp[immediateParentId] = {
          [block.type]: {
            [block.id]: block
          }
        };
      } else if (!hold[block.type]) {
        hold[block.type] = {
          [block.id]: block
        };
      } else {
        hold[block.type][block.id] = block;
      }
    } else if (block.type === "org") {
      block.path = `orgs.${block.id}`;
      orgs[block.id] = block;
    } else if (block.type === "root") {
      block.path = `rootBlock`;
      rootBlock = block;
    }
  });

  /*Object.keys(temp).forEach(id => {
    let block = blocksMap[id];
    let children = temp[id];
    Object.keys(children).forEach(type => (block[type] = children[type]));
  });*/

  if (rootBlock) {
    assignPath(rootBlock, childrenFields, null, replaceWithPath);
  }

  Object.keys(orgs).forEach(orgId =>
    assignPath(orgs[orgId], childrenFields, null, replaceWithPath)
  );

  return {
    rootBlock,
    orgs,
    assignedTasks,
    replaceWithPath
  };
}

export function assignPath(block, childrenPath, parent, replaceWithPath) {
  if (!block.path) {
    if (parent) {
      block.path = `${parent.path}.${block.type}s.${block.id}`;
    } else {
      block.path = `${block.type}s.${block.id}`;
    }
  }

  if (replaceWithPath && replaceWithPath[block.id]) {
    replaceWithPath[block.id] = block.path;
  }

  if (childrenPath) {
    childrenPath.forEach(childPath => {
      let children = block[childPath];
      if (children) {
        Object.keys(children).forEach(id => {
          assignPath(children[id], childrenPath, block);
        });
      }
    });
  }
}

export function assignTask(collaborator, by) {
  return {
    userId: collaborator.id,
    assignedAt: Date.now(),
    assignedBy: by ? by.id : null,
    completedAt: null
  };
}
