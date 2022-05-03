import { IPersistedRoom } from "../../net/chat/chat";

export interface IChat {
  // Don't use customId because there's a chance it changes
  // when a chat is sent. When sending messages, we initially
  // set a temporary customId, save the chat to db and then
  // replace it with the customId returned by the server.
  customId: string;
  orgId: string;
  message: string;
  sender: string;
  roomId: string;
  createdAt: string;
  updatedAt?: string;

  // Client-side only
  sending?: boolean;
  errorMessage?: string;
  localId?: string;
}

export interface IRoomMemberWithReadCounter {
  userId: string;
  readCounter: string;
}

export interface IRoom extends IPersistedRoom {
  unseenChatsCount: number;
  chats: IChat[];
  recipientId: string;
}
