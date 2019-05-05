export function assignTask(collaborator, by) {
  return {
    userId: collaborator.customId,
    assignedAt: Date.now(),
    assignedBy: by ? by.customId : null,
    completedAt: null
  };
}

export const permittedChildrenTypes = {
  root: ["project", "group", "task"],
  org: ["project", "group", "task"],
  project: ["group", "task"],
  group: ["project", "task"],
  task: []
};
