import { IPersistedRoom } from "../../net/chat/chat";
import { IWorkspaceResource } from "../app/types";

export interface IChat extends IWorkspaceResource {
  message: string;
  roomId: string;

  // Client-side only
  sending?: boolean;
  errorMessage?: string;
  localId?: string;
}

export interface IChatRoomMemberReadCounter {
  userId: string;
  readCounter: Date | string;
}

export interface IRoom extends IPersistedRoom {
  unseenChatsCount: number;
  chats: IChat[];
  recipientId: string;
}
