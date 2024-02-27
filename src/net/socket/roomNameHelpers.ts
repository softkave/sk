import { SystemResourceType } from "../../models/app/types";
import {
  IRoomLikeResource,
  RoomResourceType,
  SubRoomResourceType,
} from "../../redux/key-value/types";

export function getSocketRoomInfo(name: string): IRoomLikeResource | null {
  const isChatRoom = name.startsWith(`${SystemResourceType.ChatRoom}-`);

  if (isChatRoom) {
    const roomId = name.replace(`${SystemResourceType.ChatRoom}-`, "");
    return {
      customId: roomId,
      type: SystemResourceType.ChatRoom,
    };
  }

  const parts = name.split("/");

  if (parts.length < 2) {
    return null;
  }

  const [type, customId, subRoom] = parts;
  return {
    customId,
    type: type as RoomResourceType,
    subRoom: subRoom as SubRoomResourceType,
  };
}

export function getSocketRoomName(room: IRoomLikeResource): string {
  if (room.type === SystemResourceType.ChatRoom) {
    return `${SystemResourceType.ChatRoom}-${room.customId}`;
  }

  if (room.subRoom) {
    return `${room.type}/${room.customId}/${room.subRoom}`;
  }

  return `${room.type}/${room.customId}`;
}
