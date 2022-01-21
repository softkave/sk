import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import { messages } from "../../models/messages";
import { getSelectors } from "../utils";

const collaborationRequestSelectors = getSelectors<ICollaborationRequest>(
    "collaborationRequests",
    { notFoundMessage: messages.collaborationRequestNotFound }
);

export default collaborationRequestSelectors;
