import { ICollaborator } from "../../models/collaborator/types";

export interface IUsersState {
  [key: string]: ICollaborator;
}
