import randomColor from "randomcolor";
import {
  BlockType,
  IBlock,
  ISubTask,
  ITaskCollaborator
} from "../../models/block/block";
import { getBlockValidChildrenTypes } from "../../models/block/utils";
import { IUser } from "../../models/user/user";
import cast from "../../utils/cast";
import { newId } from "../../utils/utils";

export function makeBlockParentIDs(parent: IBlock) {
  const ancestors = Array.isArray(parent.parents) ? parent.parents : [];
  return [...ancestors, parent.customId];
}

export default function getNewBlock(
  user: IUser,
  type: BlockType,
  parent?: IBlock
): IBlock {
  const getParents = () => {
    if (parent) {
      return makeBlockParentIDs(parent);
    }
  };

  const childrenTypes = getBlockValidChildrenTypes(type);

  // TODO: Move creation of ids ( any resource at all ) to the server
  // Maybe get the id from the server when a form is created without an initial data, or without data with id
  const newBlock: IBlock = {
    type,
    customId: newId(),
    createdAt: Date.now(),
    createdBy: user.customId,
    color: randomColor(),
    groupTaskContext: [],
    groupProjectContext: [],
    parents: getParents(),
    collaborators: type === "org" ? [user.customId] : undefined,
    taskCollaborationType:
      type === "task" ? { collaborationType: "collective" } : undefined,
    taskCollaborators:
      type === "task" ? ([] as ITaskCollaborator[]) : undefined,
    tasks: childrenTypes.indexOf("task") ? [] : undefined,
    projects: childrenTypes.indexOf("group") ? [] : undefined,
    groups: childrenTypes.indexOf("project") ? [] : undefined,

    // @ts-ignore
    name: undefined,
    description: undefined,
    expectedEndAt: undefined,
    updatedAt: undefined,
    priority: type === "task" ? "important" : undefined,
    isBacklog: false,
    roles: undefined,
    collaborationRequests: type === "org" ? [] : undefined
  };

  return cast<IBlock>(newBlock);
}

export type INewBlock = ReturnType<typeof getNewBlock>;

export function addCustomIDToSubTasks(subTasks?: ISubTask[]) {
  return Array.isArray(subTasks)
    ? subTasks.map(subTask => ({
        ...subTask,
        customId: subTask.customId || newId()
      }))
    : [];
}
