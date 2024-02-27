import { ICollaborator } from "../../models/collaborator/types";

export interface ICollaboratorChatRoom {
  recipient: ICollaborator;
  orgId: string;
  unseenChatsCount: number;
  lastChatCreatedAt?: number;
  isTempRoom: boolean;
}
