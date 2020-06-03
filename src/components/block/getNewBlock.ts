import randomColor from "randomcolor";
import {
  BlockPriority,
  BlockType,
  IAssignee,
  IBlock,
  ISubTask,
} from "../../models/block/block";
import {
  getBlockValidChildrenTypes,
  getDefaultStatuses,
} from "../../models/block/utils";
import { IUser } from "../../models/user/user";
import cast from "../../utils/cast";
import { getDateString, newId } from "../../utils/utils";

export default function getNewBlock(
  user: IUser,
  type: BlockType,
  parent?: IBlock
): IBlock {
  const childrenTypes = getBlockValidChildrenTypes(type);

  // TODO: Move creation of ids ( any resource at all ) to the server
  // Maybe get the id from the server when a form is created without an initial data, or without data with id
  const newBlock: IBlock = {
    type,
    customId: newId(),
    createdAt: getDateString(),
    createdBy: user.customId,
    color: randomColor(),
    parent: parent ? parent.customId : undefined,
    rootBlockId: parent
      ? parent.type === BlockType.Org
        ? parent.customId
        : parent.rootBlockId
      : undefined,
    assignees: type === BlockType.Task ? ([] as IAssignee[]) : undefined,
    tasks: childrenTypes.indexOf(BlockType.Task) ? [] : undefined,
    boards: childrenTypes.indexOf(BlockType.Board) ? [] : undefined,

    // @ts-ignore
    name: undefined,
    description: undefined,
    dueAt: undefined,
    updatedAt: undefined,
    priority: type === BlockType.Task ? BlockPriority.Important : undefined,
    boardLabels: [],
    boardStatuses:
      type === BlockType.Org ? getDefaultStatuses(user) : undefined,
    updatedBy: undefined,
    subTasks: [],
    status: undefined, // TODO: where is task initial status set?
    statusAssignedBy: user.customId,
    statusAssignedAt: getDateString(),
    labels: [],

    notifications: type === "org" ? [] : undefined,
    collaborators: type === "org" ? [user.customId] : undefined,
  };

  return cast<IBlock>(newBlock);
}

export type INewBlock = ReturnType<typeof getNewBlock>;

export function addCustomIdToSubTasks(subTasks?: ISubTask[]) {
  return Array.isArray(subTasks)
    ? subTasks.map((subTask) => ({
        ...subTask,
        customId: subTask.customId || newId(),
      }))
    : [];
}
