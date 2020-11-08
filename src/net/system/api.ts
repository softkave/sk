import queryWithAuth, { isUserSignedIn } from "../auth";
import query from "../query";
import { sendFeedbackMutation } from "./schema";

export interface ISendFeedbackAPIProps {
    feedback: string;
    description?: string;
    notifyEmail?: string;
}

function sendFeedback(props: ISendFeedbackAPIProps) {
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
