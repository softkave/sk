import { ICollaborator } from "../../models/collaborator/types";
import { getActions } from "../utils";

const UserActions = getActions<ICollaborator>("user");

export default UserActions;
