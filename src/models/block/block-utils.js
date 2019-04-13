import get from "lodash/get";

export function getBlockParent(block, state) {
  return get(
    state,
    block.path
      .split(".")
      .slice(0, -2)
      .join(".")
  );
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
