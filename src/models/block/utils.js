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
  group: ["project", "task"],
  task: []
};

export function getBlockValidChildrenTypes(block) {
  return validChildrenTypesMap[block.type] || [];
}
