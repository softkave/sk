import { ICollaborator } from "../../models/collaborator/types";
import { appMessages } from "../../models/messages";
import { getSelectors } from "../utils";

const UserSelectors = getSelectors<ICollaborator>("users", {
  notFoundMessage: appMessages.collaboratorNotFound,
});

export default UserSelectors;
