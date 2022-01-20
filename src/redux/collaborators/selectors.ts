import { ICollaborator } from "../../models/collaborator/types";
import { getSelectors } from "../utils";

const CollaboratorSelectors = getSelectors<ICollaborator>("collaborators");

export default CollaboratorSelectors;
