import get from "lodash/get";
import { mergeDataByPath, deleteDataByPath } from "../redux/actions/data";
import netInterface from "../net";
import randomColor from "randomcolor";

//const uuid = require("uuid/v4");
const nanoid = require("nanoid");

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
  function prepareTaskFromEditData(task) {
    // if (task.priority) {
    //   task.data = [{ dataType: "priority", data: task.priority }];
    //   delete task.priority;
    // }

    if (task.expectedEndAt) {
      task.expectedEndAt = task.expectedEndAt.valueOf();
    }

    return task;
  }

  return {
    async onAdd(task, parent) {
      console.log(task, parent);
      //task.type = "task";
      task.createdAt = Date.now();
      task.createdBy = user.id;
      /*task.collaborators = [];
      if (autoAssign) {
        task.collaborators.push({
          userId: user.id,
          data: [{ dataType: "completedAt", data: null }]
        });
      }*/

      // would be assigned by server
      task.id = nanoid();
      task.color = randomColor();
      if (parent) {
        task.path = `${parent.path}.${task.type}s.${task.id}`;
        task.parents = [];
        if (parent.parents) {
          task.parents = task.parents.concat(parent.parents);
        }

        task.parents.push(parent.id);
        task.owner = parent.owner;
      } else {
        task.path = `${task.type}s.${task.id}`;
        task.owner = task.id;
      }

      task = prepareTaskFromEditData(task);
      dispatch(mergeDataByPath(task.path, task));
      netInterface("block.createBlock", task);
    },

    onUpdate(task, data) {
      data = prepareTaskFromEditData(data);
      dispatch(mergeDataByPath(task.path, data));
      netInterface("block.updateBlock", task, data);
    },

    onToggle(task) {
      const collaboratorIndex = task.collaborators.findIndex(
        c => c.userId === user.id
      );
      const collaborator = task.collaborators[collaboratorIndex];
      const path = `${task.path}.collaborators.${collaboratorIndex}.data`;
      dispatch(mergeDataByPath(path, collaborator.data ? null : Date.now()));
      netInterface("block.toggleTask", { task });
    },

    onDelete(task) {
      dispatch(deleteDataByPath(task.path));
      netInterface("block.deleteBlock", task);
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
