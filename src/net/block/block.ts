import auth from "../auth";
import { IEndpointResultBase } from "../types";
import {
    addBlockMutation,
    addCollaboratorsMutation,
    deleteBlockMutation,
    getAverageTimeToCompleteTasksQuery,
    getBlockChildrenQuery,
    getRootBlocksQuery,
    removeCollaboratorMutation,
    revokeRequestMutation,
    updateBlockMutation,
} from "./schema";
import {
    IAddBlockEndpointParams,
    IAddBlockEndpointResult,
    IAddCollaboratorAPIParams,
    IAddCollaboratorAPIResult,
    IDeleteBlockAPIParams,
    IGetBlockChildrenAPIParams,
    IGetBlockChildrenAPIResult,
    IGetUserRootBlocksAPIResult,
    IRemoveCollaboratorAPIParams,
    IRevokeRequestAPIParams,
    IUpdateBlockAPIParams,
    IUpdateBlockAPIResult,
} from "./types";

async function addBlock(
    props: IAddBlockEndpointParams
): Promise<IAddBlockEndpointResult> {
    return auth(null, addBlockMutation, props, "data.block.addBlock");
}

async function updateBlock(
    props: IUpdateBlockAPIParams
): Promise<IUpdateBlockAPIResult> {
    return auth(null, updateBlockMutation, props, "data.block.updateBlock");
}

async function deleteBlock(
    props: IDeleteBlockAPIParams
): Promise<IEndpointResultBase> {
    return auth(null, deleteBlockMutation, props, "data.block.deleteBlock");
}

async function getBlockChildren(
    props: IGetBlockChildrenAPIParams
): Promise<IGetBlockChildrenAPIResult> {
    return auth(
        null,
        getBlockChildrenQuery,
        props,
        "data.block.getBlockChildren"
    );
}

async function addCollaborators(
    props: IAddCollaboratorAPIParams
): Promise<IAddCollaboratorAPIResult> {
    return auth(
        null,
        addCollaboratorsMutation,
        props,
        "data.block.addCollaborators"
    );
}

function removeCollaborator(
    props: IRemoveCollaboratorAPIParams
): Promise<IEndpointResultBase> {
    return auth(
        null,
        removeCollaboratorMutation,
        props,
        "data.block.removeCollaborator"
    );
}

function getUserRootBlocks(): Promise<IGetUserRootBlocksAPIResult> {
    return auth(null, getRootBlocksQuery, {}, "data.block.getUserRootBlocks");
}

function revokeRequest(
    props: IRevokeRequestAPIParams
): Promise<IEndpointResultBase> {
    return auth(
        null,
        revokeRequestMutation,
        props,
        "data.block.revokeCollaborationRequest"
    );
}

export interface IGetAverageTimeToCompleteTasksEndpointParams {
    boardId: string;
}

export interface IGetAverageTimeToCompleteTasksEndpointResponse
    extends IEndpointResultBase {
    avg: number;
}

function getAverageTimeToCompleteTasks(
    props: IGetAverageTimeToCompleteTasksEndpointParams
): Promise<IGetAverageTimeToCompleteTasksEndpointResponse> {
    return auth(
        null,
        getAverageTimeToCompleteTasksQuery,
        props,
        "data.block.getAverageTimeToCompleteTasks"
    );
}

export default abstract class BlockAPI {
    public static addBlock = addBlock;
    public static updateBlock = updateBlock;
    public static deleteBlock = deleteBlock;
    public static getBlockChildren = getBlockChildren;
    public static addCollaborators = addCollaborators;
    public static removeCollaborator = removeCollaborator;
    public static getUserRootBlocks = getUserRootBlocks;
    public static revokeRequest = revokeRequest;
    public static getAverageTimeToCompleteTasks = getAverageTimeToCompleteTasks;
}
