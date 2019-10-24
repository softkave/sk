import randomColor from "randomcolor";
import {
  BlockType,
  IBlock,
  ITaskCollaborator,
  taskPriority
} from "../../models/block/block";
import { getBlockValidChildrenTypes } from "../../models/block/utils";
import { IUser } from "../../models/user/user";
import cast from "../../utils/cast";
import { newId } from "../../utils/utils";

export default function getNewBlock(
  user: IUser,
  type: BlockType,
  parent?: IBlock
): IBlock {
  const getParents = () => {
    if (parent) {
      const ancestors = Array.isArray(parent.parents) ? parent.parents : [];
      return [...ancestors, parent.customId];
    } else {
      return [] as string[];
    }
  };

  const childrenTypes = getBlockValidChildrenTypes({ type });

  // TODO: Move creation of ids ( any resource at all ) to the server
  // Maybe get the id from the server when a form is created without an initial data, or without data with id
  const newBlock = {
    type,
    customId: newId(),
    createdAt: Date.now(),
    createdBy: user.customId,
    color: randomColor(),
    groupTaskContext: [],
    groupProjectContext: [],
    parents: getParents(),
    collaborators: type === "org" ? [user.customId] : undefined,
    taskCollaborators:
      type === "task" ? ([] as ITaskCollaborator[]) : undefined,
    tasks: childrenTypes.indexOf("task") ? [] : undefined,
    projects: childrenTypes.indexOf("group") ? [] : undefined,
    groups: childrenTypes.indexOf("project") ? [] : undefined,
    name: undefined,
    description: undefined,
    expectedEndAt: undefined,
    updatedAt: undefined,
    priority: type === "task" ? taskPriority.important : undefined,
    isBacklog: false,
    roles: undefined,
    collaborationRequests: type === "org" ? [] : undefined
  };

  return cast<IBlock>(newBlock);
}

export type INewBlock = ReturnType<typeof getNewBlock>;
