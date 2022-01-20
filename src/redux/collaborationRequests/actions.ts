import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import { getActions } from "../utils";

const collaborationRequestActions = getActions<ICollaborationRequest>(
    "collaborationRequest"
);

export default collaborationRequestActions;
