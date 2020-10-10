import { IPersistedRoom } from "../../net/chat";
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
