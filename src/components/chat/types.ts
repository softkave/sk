import { ICollaborator } from "../../models/collaborator/types";

export interface IAppChatRoom {
  recipient: ICollaborator;
  orgId: string;
  unseenChatsCount: number;
  lastChatCreatedAt?: number;
  isTempRoom: boolean;
}
