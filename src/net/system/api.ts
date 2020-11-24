import queryWithAuth, { isUserSignedIn } from "../auth";
import query from "../query";
import { GetEndpointResultError, IEndpointResultBase } from "../types";
import { sendFeedbackMutation } from "./schema";

export interface ISendFeedbackEndpointParams {
    feedback: string;
    description?: string;
    notifyEmail?: string;
}

export type ISendFeedbackEndpointResult = IEndpointResultBase;
export type ISendFeedbackEndpointErrors = GetEndpointResultError<
    ISendFeedbackEndpointParams
>;

async function sendFeedback(
    props: ISendFeedbackEndpointParams
): Promise<ISendFeedbackEndpointResult> {
    if (isUserSignedIn()) {
        return queryWithAuth(
            null,
            sendFeedbackMutation,
            props,
            "data.system.sendFeedback"
        );
    } else {
        return query(
            null,
            sendFeedbackMutation,
            props,
            "data.system.sendFeedback"
        );
    }
}

export default class SystemAPI {
    public static sendFeedback = sendFeedback;
}
