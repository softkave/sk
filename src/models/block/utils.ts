import { IUser } from "../user/user";
import {
  BlockType,
  IBlock,
  ITaskCollaborator,
  TaskCollaborationType
} from "./block";

export function assignTask(collaborator: IUser, by?: IUser): ITaskCollaborator {
  return {
    userId: collaborator.customId,
    assignedAt: Date.now(),
    assignedBy: by ? by.customId : collaborator.customId,
    completedAt: undefined
  };
}

type BlockTypeToTypesMap = { [key in BlockType]: BlockType[] };

export function getBlockValidChildrenTypes(
  type: BlockType,
  parentType?: BlockType | null
): BlockType[] {
  const validChildrenTypesMap: BlockTypeToTypesMap = {
    root: ["project", "group", "task"],
    org: ["project", "group", "task"],
    project: ["group", "task"],
    group: ["project", "task"],
    task: []
  };

  let types = validChildrenTypesMap[type] || [];

  if (type === "group") {
    if (parentType === "project") {
      types = types.filter(nextType => nextType !== "project");
    }
  }

  return [...types];
}

export function getUserTaskCollaborator(task: IBlock, user: IUser) {
  return Array.isArray(task.taskCollaborators)
    ? task.taskCollaborators.find(item => {
        return item.userId === user.customId;
      })
    : null;
}

export function getBlockValidParentTypes(type: BlockType): BlockType[] {
  const validParentsMap: BlockTypeToTypesMap = {
    root: [],
    org: [],
    project: ["root", "org", "group"],
    group: ["root", "org", "project"],
    task: ["root", "org", "project", "group"]
  };

  const types = validParentsMap[type] || [];
  return [...types];
}

export function filterBlocksWithTypes(blocks: IBlock[], types: BlockType[]) {
  return blocks.filter(block => types.indexOf(block.type) !== -1);
}

export function filterValidParentsForBlockType(
  parents: IBlock[],
  type: BlockType
) {
  const validParentTypes = getBlockValidParentTypes(type);
  return filterBlocksWithTypes(parents, validParentTypes);
}

export function isBlockParentOf(parent: IBlock, block: IBlock) {
  return parent.customId === block.parent;
}

export function getBlockPositionFromParent(parent: IBlock, block: IBlock) {
  const blockTypeContainerName = `${block.type}s`;
  const blockTypeContainer = parent[blockTypeContainerName];

  if (Array.isArray(blockTypeContainer)) {
    return blockTypeContainer.indexOf(block.customId);
  }
}

export const getBlockTypeFullName = (type: BlockType) => {
  switch (type) {
    case "org":
      return "organization";
    case "group":
      return "group";
    case "project":
      return "project";
    case "task":
      return "task";
    default:
      return "block";
  }
};

export interface ITaskCompletionData {
  type: TaskCollaborationType;
  isCompeleted: boolean;
  totalCollaboratorsNum: number;
  hasCompletedNum: number;
  userHasCompleted: boolean;
  userIsAssigned: boolean;
}

export const getTaskCompletionData = (
  task: IBlock,
  user: IUser
): ITaskCompletionData => {
  const userData = getUserTaskCollaborator(task, user);
  const taskCollaborators = task.taskCollaborators || [];
  const type = task.taskCollaborationData!.collaborationType || "collective";
  const totalCollaboratorsNum = taskCollaborators.length;
  const userIsAssigned = !!userData;
  let userHasCompleted;
  let isCompeleted;
  let hasCompletedNum;

  if (type === "collective") {
    isCompeleted = !!task.taskCollaborationData!.completedAt;
    hasCompletedNum = totalCollaboratorsNum;
    userHasCompleted = isCompeleted && userIsAssigned;
  } else {
    const completed = taskCollaborators.filter(
      collaborator => !!collaborator.completedAt
    );
    userHasCompleted = userData && userData.completedAt;
    isCompeleted =
      taskCollaborators.length > 0 &&
      taskCollaborators.length === completed.length
        ? true
        : false;
    hasCompletedNum = completed.length;
  }

  return {
    type,
    totalCollaboratorsNum,
    isCompeleted,
    userHasCompleted,
    hasCompletedNum,
    userIsAssigned
  };
};

export const isTaskCompleted = (task: IBlock, user: IUser) => {
  const userTaskCollaboratorData = getUserTaskCollaborator(task, user);
  const taskCollaborators = task.taskCollaborators || [];
  const collaborationType =
    task.taskCollaborationData!.collaborationType || "collective";

  if (collaborationType === "collective") {
    return !!task.taskCollaborationData!.completedAt;
  } else {
    const hasCompleted = taskCollaborators.filter(
      collaborator => !!collaborator.completedAt
    );
    return userTaskCollaboratorData && !!userTaskCollaboratorData.completedAt
      ? true
      : taskCollaborators.length === hasCompleted.length
      ? true
      : false;
  }
};
