import { IAddCollaboratorFormItemValues } from "../../components/collaborator/AddCollaboratorFormItem";
import { BlockType, IBlock } from "../../models/block/block";
import { INotification } from "../../models/notification/notification";
import { IUser } from "../../models/user/user";
import { getDataFromObject } from "../../utils/utils";
import auth from "../auth";
import {
    addBlockMutation,
    addCollaboratorsMutation,
    deleteBlockMutation,
    getBlockChildrenQuery,
    getRootBlocksQuery,
    removeCollaboratorMutation,
    revokeRequestMutation,
    transferBlockMutation,
    updateBlockMutation,
} from "./schema";

function addBlock(block: IBlock) {
    // TODO: Find a way to define central structures that'll be used by server and client, including
    // mongo schemas, graphql schemas, extract functions, and other places.
    // TODO: define the type of the arguments, so that we can avoid using fields
    const fields = [
        "customId",
        "type",
        "name",
        "description",
        "dueAt",
        "color",
        "parent",
        "rootBlockId",
        "assignees",
        "priority",
        "subTasks",
        "boardStatuses",
        "boardLabels",
        "boardResolutions",
        "status",
        "statusAssignedBy",
        "statusAssignedAt",
        "taskResolution",
        "labels",
        "taskSprint",
    ];

    return auth(
        null,
        addBlockMutation,
        { block: getDataFromObject(block, fields) },
        "data.block.addBlock"
    );
}

function updateBlock(block: IBlock, data: Partial<IBlock>) {
    const dataFields = [
        "name",
        "description",
        "color",
        "priority",
        "parent",
        "subTasks",
        "dueAt",
        "assignees",
        "boardStatuses",
        "boardLabels",
        "boardResolutions",
        "status",
        "statusAssignedBy",
        "statusAssignedAt",
        "taskResolution",
        "labels",
        "taskSprint",
    ];

    return auth(
        null,
        updateBlockMutation,
        {
            blockId: block.customId,
            data: {
                ...getDataFromObject(data, dataFields),
            },
        },
        "data.block.updateBlock"
    );
}

function deleteBlock(block: IBlock) {
    return auth(
        null,
        deleteBlockMutation,
        { blockId: block.customId },
        "data.block.deleteBlock"
    );
}

function getBlockChildren(block: IBlock, typeList?: BlockType[]) {
    return auth(
        null,
        getBlockChildrenQuery,
        { typeList, blockId: block.customId },
        "data.block.getBlockChildren"
    );
}

function addCollaborators(
    block: IBlock,
    collaborators: IAddCollaboratorFormItemValues[]
) {
    const collaboratorFields = ["email", "body", "expiresAt", "customId"];
    return auth(
        null,
        addCollaboratorsMutation,
        {
            blockId: block.customId,
            collaborators: collaborators.map((request) =>
                getDataFromObject(request, collaboratorFields)
            ),
        },
        "data.block.addCollaborators"
    );
}

function removeCollaborator(block: IBlock, collaborator: IUser) {
    return auth(
        null,
        removeCollaboratorMutation,
        {
            blockId: block.customId,
            collaboratorId: collaborator.customId,
        },
        "data.block.removeCollaborator"
    );
}

function getUserRootBlocks() {
    return auth(null, getRootBlocksQuery, {}, "data.block.getUserRootBlocks");
}

function revokeRequest(block: IBlock, request: INotification) {
    return auth(
        null,
        revokeRequestMutation,
        {
            requestId: request.customId,
            blockId: block.customId,
        },
        "data.block.revokeCollaborationRequest"
    );
}

function transferBlock(draggedBlock: IBlock, destinationBlock: IBlock) {
    return auth(
        null,
        transferBlockMutation,
        {
            draggedBlockId: draggedBlock.customId,
            destinationBlockId: destinationBlock.customId,
        },
        "data.block.transferBlock"
    );
}

export default class BlockAPI {
    public static addBlock = addBlock;
    public static updateBlock = updateBlock;
    public static deleteBlock = deleteBlock;
    public static getBlockChildren = getBlockChildren;
    public static addCollaborators = addCollaborators;
    public static removeCollaborator = removeCollaborator;
    public static getUserRootBlocks = getUserRootBlocks;
    public static revokeRequest = revokeRequest;
    public static transferBlock = transferBlock;
}
