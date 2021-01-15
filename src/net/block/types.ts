import { IAddCollaboratorFormItemValues } from "../../components/collaborator/AddCollaboratorFormItem";
import {
    BlockType,
    IBlock,
    INewBlockInput,
    IUpdateBlockInput,
} from "../../models/block/block";
import { IComment } from "../../models/comment/types";
import { INotification } from "../../models/notification/notification";
import { GetEndpointResult, GetEndpointResultError } from "../types";

export interface IAddBlockEndpointParams {
    block: INewBlockInput;
}

export type IAddBlockEndpointResult = GetEndpointResult<{ block: IBlock }>;
export type IAddBlockEndpointErrors = GetEndpointResultError<IAddBlockEndpointParams>;

export interface IUpdateBlockAPIParams {
    blockId: string;
    data: IUpdateBlockInput;
}

export type IUpdateBlockAPIResult = GetEndpointResult<{ block: IBlock }>;

export interface IDeleteBlockAPIParams {
    blockId: string;
}

export interface IGetBlockChildrenAPIParams {
    blockId: string;
    typeList?: BlockType[];
}

export type IGetBlockChildrenAPIResult = GetEndpointResult<{
    blocks: IBlock[];
}>;

export interface IAddCollaboratorAPIParams {
    blockId: string;
    collaborators: IAddCollaboratorFormItemValues[];
}

export type IAddCollaboratorEndpointErrors = GetEndpointResultError<IAddCollaboratorAPIParams>;

export type IAddCollaboratorAPIResult = GetEndpointResult<{
    requests: INotification[];
}>;

export interface IRemoveCollaboratorAPIParams {
    blockId: string;
    collaboratorId: string;
}

export type IGetUserRootBlocksAPIResult = GetEndpointResult<{
    blocks: IBlock[];
}>;

export interface IRevokeRequestAPIParams {
    blockId: string;
    requestId: string;
}
