import moment from "moment";
import { IRoom } from "../../models/chat/types";

export function getChatIndex(
  room: IRoom,
  chatLocalId: string,
  fromDate?: string
) {
  // Since most chats we update are recent, like when updating a
  // newly sent chat with it's server customId or a chat received
  // from a socket update, it's safe to assume that the chat will
  // be found around the end of the array.
  for (let i = room.chats.length - 1; i >= 0; i--) {
    if (room.chats[i].localId === chatLocalId) {
      return i;
    } else if (fromDate && moment(room.chats[i].createdAt).isBefore(fromDate)) {
      return -1;
    }
  }

  return -1;
}
