import { ICollaborator } from "../../models/collaborator/types";
import { messages } from "../../models/messages";
import { getSelectors } from "../utils";

const UserSelectors = getSelectors<ICollaborator>("users", {
    notFoundMessage: messages.collaboratorNotFound,
});

export default UserSelectors;
