import { IUser } from "../user/user";
import { ITaskCollaborator } from "./block";

export function assignTask(collaborator: IUser, by?: IUser): ITaskCollaborator {
  return {
    userId: collaborator.customId,
    assignedAt: Date.now(),
    assignedBy: by ? by.customId : collaborator.customId,
    completedAt: undefined
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