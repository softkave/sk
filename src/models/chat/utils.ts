import { IPersistedRoom } from "../../net/chat/chat";
import { getNewTempId } from "../../utils/utils";
import { IRoom } from "./types";

export function getRoomFromPersistedRoom(
  persistedRoom: IPersistedRoom,
  userId: string
): IRoom {
  const room: IRoom = {
    ...persistedRoom,
    unseenChatsStartIndex: null,
    unseenChatsCount: 0,
    chats: [],
    recipientId: persistedRoom.members.find(
      (member) => member.userId !== userId
    )!.userId,
  };

  return room;
}

export function getTempRoomId(orgId: string, recipientId: string) {
  // The user and the current user may also belong to another org
  return getNewTempId(orgId + "_" + recipientId);
}

export function getUserRoomMemberData(room: IRoom) {
  return room.members.find((m) => m.userId === room.recipientId);
}

export function getRecipientRoomMemberData(room: IRoom) {
  return room.members.find((m) => m.userId !== room.recipientId);
}
