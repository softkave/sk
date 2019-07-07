export function assignTask(collaborator, by) {
  return {
    userId: collaborator.customId,
    assignedAt: Date.now(),
    assignedBy: by ? by.customId : null,
    completedAt: null
  };
}

const validChildrenTypesMap = {
  root: ["project", "group", "task"],
  org: ["project", "group", "task"],
  project: ["group", "task"],
  // root: ["group"],
  // org: ["group"],
  // project: ["group"],
  group: ["project", "task"],
  task: []
};

export function getBlockValidChildrenTypes(block) {
  const types = validChildrenTypesMap[block.type] || [];
  return [...types];
}
