import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import { getSelectors } from "../utils";

const collaborationRequestSelectors = getSelectors<ICollaborationRequest>(
    "collaborationRequests"
);

export default collaborationRequestSelectors;
