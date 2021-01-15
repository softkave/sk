import { IComment } from "../../models/comment/types";
import { GetEndpointResult, IEndpointResultBase } from "../types";
import auth from "../auth";
import { addCommentMutation, getTaskCommentsQuery } from "./schema";

export interface IAddCommentAPIParameters {
    taskId: string;
    comment: string;
}

export interface IAddCommentAPIResult extends IEndpointResultBase {
    comment: IComment;
}

async function addComment(
    props: IAddCommentAPIParameters
): Promise<IAddCommentAPIResult> {
    return auth(null, addCommentMutation, props, "data.comments.addComment");
}

export interface IGetTaskCommentsAPIParams {
    taskId: string;
}

export type IGetTaskCommentsAPIResult = GetEndpointResult<{
    comments: IComment[];
}>;

async function getTaskComments(
    props: IGetTaskCommentsAPIParams
): Promise<IGetTaskCommentsAPIResult> {
    return auth(
        null,
        getTaskCommentsQuery,
        props,
        "data.comments.getTaskComments"
    );
}

export default class CommentAPI {
    public static addComment = addComment;
    public static getTaskComments = getTaskComments;
}
