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

type BlockTypeToTypesMap = { [key in BlockType]: BlockType[] };

export function getBlockValidChildrenTypes(type: BlockType): BlockType[] {
  const validChildrenTypesMap: BlockTypeToTypesMap = {
    root: ["project", "group", "task"],
    org: ["project", "group", "task"],
    project: ["group", "task"],
    group: ["project", "task"],
    task: []
  };

  const types = validChildrenTypesMap[type] || [];
  return [...types];
}

export function aggregateBlocksParentIDs(blocks: IBlock[]) {
  const mappedParentIDs = blocks.reduce((accumulator, block) => {
    block.parents.forEach(parentID => (accumulator[parentID] = parentID));
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
  return parent.customId === block.parents[block.parents.length - 1];
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
