import { IUser } from "../user/user";
import { BlockType, IBlock, ITaskCollaborator } from "./block";

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
  group: ["project", "task"],
  task: []
};

export function getBlockValidChildrenTypes(block): BlockType[] {
  const types = validChildrenTypesMap[block.type] || [];
  return [...types];
}

export function aggregateBlocksParentIDs(blocks: IBlock[]) {
  const mappedParentIDs = blocks.reduce((accumulator, task) => {
    task.parents.forEach(parentID => (accumulator[parentID] = parentID));
    return accumulator;
  }, {});

  const parentIDs = Object.keys(mappedParentIDs);

  return parentIDs;
}

export function getUserTaskCollaborator(task: IBlock, user: IUser) {
  return Array.isArray(task.taskCollaborators)
    ? task.taskCollaborators.find(item => {
        return item.userId === user.customId;
      })
    : null;
}
