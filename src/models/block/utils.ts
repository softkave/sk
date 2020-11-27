import { getDateString, getNewId } from "../../utils/utils";
import { IUser } from "../user/user";
import { BlockType, IBlock, IBlockStatus, ITaskAssignee } from "./block";

export function assignTask(collaborator: IUser, by?: IUser): ITaskAssignee {
    return {
        userId: collaborator.customId,
        assignedAt: getDateString(),
        assignedBy: by ? by.customId : collaborator.customId,
    };
}

type BlockTypeToTypesMap = { [key in BlockType]: BlockType[] };

export function getBlockValidChildrenTypes(type: BlockType): BlockType[] {
    const validChildrenTypesMap: BlockTypeToTypesMap = {
        root: [BlockType.Board],
        org: [BlockType.Board],
        board: [BlockType.Task],
        task: [],
    };

    const types = validChildrenTypesMap[type] || [];

    return [...types];
}

export function getUserTaskCollaborator(task: IBlock, user: IUser) {
    return Array.isArray(task.assignees)
        ? task.assignees.find((item) => {
              return item.userId === user.customId;
          })
        : null;
}

export function getBlockValidParentTypes(type: BlockType): BlockType[] {
    const validParentsMap: BlockTypeToTypesMap = {
        root: [],
        org: [],
        board: [BlockType.Root, BlockType.Org],
        task: [BlockType.Board],
    };

    const types = validParentsMap[type] || [];
    return [...types];
}

export function filterBlocksWithTypes(blocks: IBlock[], types: BlockType[]) {
    return blocks.filter((block) => types.indexOf(block.type) !== -1);
}

export function filterValidParentsForBlockType(
    parents: IBlock[],
    type: BlockType
) {
    const validParentTypes = getBlockValidParentTypes(type);
    return filterBlocksWithTypes(parents, validParentTypes);
}

export function getBlockPositionFromParent(parent: IBlock, block: IBlock) {
    const blockTypeContainerName = `${block.type}s`;
    const blockTypeContainer = parent[blockTypeContainerName];

    if (Array.isArray(blockTypeContainer)) {
        return blockTypeContainer.indexOf(block.customId);
    }
}

export const getDefaultStatuses = (user: IUser): IBlockStatus[] => {
    return [
        {
            name: "Todo",
            description: "Available tasks",
            createdAt: getDateString(),
            createdBy: user.customId,
            customId: getNewId(),
            color: "#f28b79",
        },
        {
            name: "In progress",
            description: "Currently being worked on",
            createdAt: getDateString(),
            createdBy: user.customId,
            customId: getNewId(),
            color: "#aa2244",
        },
        {
            name: "Pending review",
            description: "Completed, pending review",
            createdAt: getDateString(),
            createdBy: user.customId,
            customId: getNewId(),
            color: "#ffd3c6",
        },
        {
            name: "Done",
            description: "Completed, and reviewed",
            createdAt: getDateString(),
            createdBy: user.customId,
            customId: getNewId(),
            color: "#25b71b",
        },
    ];
};

export function isTaskInLastStatus(task: IBlock, statusList: IBlockStatus[]) {
    const lastStatus = statusList[statusList.length - 1];
    
    if (lastStatus) {
        return task.status === lastStatus.customId;
    }

    return true;
}
