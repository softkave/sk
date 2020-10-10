import randomColor from "randomcolor";
import {
    BlockPriority,
    BlockType,
    IBlock,
    ISubTask,
    ITaskAssignee,
} from "../../models/block/block";
import {
    getBlockValidChildrenTypes,
    getDefaultStatuses,
} from "../../models/block/utils";
import { IUser } from "../../models/user/user";
import cast from "../../utils/cast";
import { getDateString, getNewId } from "../../utils/utils";

export default function getNewBlock(
    user: IUser,
    type: BlockType,
    parent?: IBlock
): IBlock {
    const childrenTypes = getBlockValidChildrenTypes(type);
    const isTask = type === BlockType.Task;
    const isOrg = type === BlockType.Org;
    const isBoard = type === BlockType.Board;

    // TODO: Move creation of ids ( any resource at all ) to the server
    // Maybe get the id from the server when a form is created without an initial data, or without data with id
    const newBlock: IBlock = {
        type,
        customId: getNewId(),
        createdAt: getDateString(),
        createdBy: user.customId,
        color: randomColor(),
        parent: parent ? parent.customId : undefined,
        rootBlockId: parent
            ? parent.type === BlockType.Org
                ? parent.customId
                : parent.rootBlockId
            : undefined,
        assignees: isTask ? ([] as ITaskAssignee[]) : undefined,
        boards: childrenTypes.indexOf(BlockType.Board) ? [] : undefined,

        // @ts-ignore
        name: undefined,
        description: undefined,
        dueAt: undefined,
        updatedAt: undefined,
        priority: isTask ? BlockPriority.Important : undefined,
        boardLabels: [],
        boardStatuses: isOrg
            ? getDefaultStatuses(user)
            : isBoard
            ? parent?.boardStatuses || getDefaultStatuses(user)
            : [],
        boardResolutions: isBoard ? [] : undefined,
        updatedBy: undefined,
        subTasks: [],
        status: undefined, // TODO: where is task initial status set?
        statusAssignedBy: isTask ? user.customId : undefined,
        statusAssignedAt: isTask ? getDateString() : undefined,
        labels: [],

        notifications: isOrg ? [] : undefined,
        collaborators: isOrg ? [user.customId] : undefined,
    };

    return cast<IBlock>(newBlock);
}

export type INewBlock = ReturnType<typeof getNewBlock>;

export function addCustomIdToSubTasks(subTasks?: ISubTask[]) {
    return Array.isArray(subTasks)
        ? subTasks.map((subTask) => ({
              ...subTask,
              customId: subTask.customId || getNewId(),
          }))
        : [];
}
