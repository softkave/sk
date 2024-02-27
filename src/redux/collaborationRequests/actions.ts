import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import { getActions } from "../utils";

const CollaborationRequestActions = getActions<ICollaborationRequest>(
  "collaborationRequest"
);

export default CollaborationRequestActions;
