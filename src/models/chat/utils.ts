import moment from "moment";
import { IPersistedRoom } from "../../net/chat/chat";
import { getNewId02 } from "../../utils/ids";
import { SystemResourceType } from "../app/types";
import { IChat, IRoom } from "./types";

export function getRoomFromPersistedRoom(
  persistedRoom: IPersistedRoom,
  userId: string,
  extra: Partial<Omit<IRoom, keyof IPersistedRoom>> = {}
): IRoom {
  const room: IRoom = {
    ...persistedRoom,
    ...extra,
    unseenChatsCount: 0,
    chats: [],
    recipientId: persistedRoom.members.find((member) => member.userId !== userId)!.userId,
  };

  return room;
}

export function getTempRoomId(orgId: string, recipientId: string) {
  // The user and the current user may also belong to another org
  return getNewId02(SystemResourceType.Temporary, orgId + "_" + recipientId);
}

export function getUserRoomMemberData(room: IRoom) {
  return room.members.find((m) => m.userId === room.recipientId);
}

export function getRecipientRoomMemberData(room: IRoom) {
  return room.members.find((m) => m.userId !== room.recipientId);
}

export function prepareRoomChats(room: IRoom, chats: IChat[]) {
  room = { ...room };
  room.chats = chats;
  room.chats.sort((chat1, chat2) => {
    const chat1SentTimestamp = moment(chat1.createdAt).valueOf();
    const chat2SentTimestamp = moment(chat2.createdAt).valueOf();
    if (chat1SentTimestamp > chat2SentTimestamp) {
      return 1;
    } else if (chat1SentTimestamp < chat2SentTimestamp) {
      return -1;
    } else {
      return 0;
    }
  });

  return room;
}
