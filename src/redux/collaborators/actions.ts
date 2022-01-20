import { ICollaborator } from "../../models/collaborator/types";
import { getActions } from "../utils";

const CollaboratorActions = getActions<ICollaborator>("collaborator");

export default CollaboratorActions;
