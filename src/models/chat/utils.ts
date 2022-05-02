import assert from "assert";
import { isNumber } from "lodash";
import moment from "moment";
import { IPersistedRoom } from "../../net/chat/chat";
import { getNewTempId } from "../../utils/utils";
import { IChat, IRoom } from "./types";

export function getRoomFromPersistedRoom(
  persistedRoom: IPersistedRoom,
  userId: string,
  extra: Partial<Omit<IRoom, keyof IPersistedRoom>> = {}
): IRoom {
  const room: IRoom = {
    ...persistedRoom,
    ...extra,
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

export function prepareRoomChats(room: IRoom, chats: IChat[]) {
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

  const { unseenChatsCount, unseenChatsStartIndex } =
    getRoomUserUnseenChatsCountAndStartIndex(room);
  room.unseenChatsStartIndex = unseenChatsStartIndex;
  room.unseenChatsCount = unseenChatsCount;
}

export interface IRoomUnseenChatsCountAndStartIndex {
  unseenChatsCount: number;
  unseenChatsStartIndex: number | null;
}

export function getRoomUserUnseenChatsCountAndStartIndex(
  room: IRoom
): IRoomUnseenChatsCountAndStartIndex {
  const userMemberData = getUserRoomMemberData(room);
  assert(userMemberData, "Member data not found");
  const readCounter = moment(userMemberData.readCounter);
  let unseenChatsStartIndex: number | null = room.unseenChatsStartIndex;

  if (room.unseenChatsStartIndex) {
    for (let i = room.unseenChatsStartIndex + 1; i < room.chats.length; i++) {
      const chat = room.chats[i];

      if (moment(chat.createdAt).isAfter(readCounter)) {
        break;
      }

      unseenChatsStartIndex = i;
    }
  } else {
    for (let i = room.chats.length - 1; i >= 0; i--) {
      const chat = room.chats[i];

      if (moment(chat.createdAt).isBefore(readCounter)) {
        break;
      }

      unseenChatsStartIndex = i;
    }
  }

  const unseenChatsCount =
    isNumber(unseenChatsStartIndex) && unseenChatsStartIndex >= 0
      ? room.chats.length - unseenChatsStartIndex
      : 0;

  return {
    unseenChatsCount,
    unseenChatsStartIndex,
  };
}
