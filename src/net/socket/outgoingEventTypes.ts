import { ClientSubscribedResources } from "../../redux/key-value/types";

export enum OutgoingSocketEvents {
  Auth = "auth",
  Subscribe = "subscribe",
  Unsubscribe = "unsubscribe",
  FetchMissingBroadcasts = "fetchMissingBroadcasts",
  SendMessage = "sendMessage",
  AddRoom = "addRoom",
  GetRooms = "getRooms",
  GetRoomChats = "getRoomChats",
  GetRoomsUnseenChatsCount = "getRoomsUnseenChatsCount",
  GetOrganizationUnseenChatsCount = "getOrganizationUnseenChatsCount",
  GetUserRoomsAndChats = "getUserRoomsAndChats",
  UpdateRoomReadCounter = "updateRoomReadCounter",
  UpdateSocketEntry = "updateSocketEntry",
}

export interface IOutgoingEventPacket<T = any> {
  token: string;
  clientId: string;
  data?: T;
}

export interface IOutgoingSubscribePacket {
  rooms: ClientSubscribedResources;
}

export interface IOutgoingFetchMissingBroadcastsPacket {
  rooms: string[];
  from: number;
}

export interface IOutgoingUpdateSocketEntryPacket {
  isActive?: boolean;
}
