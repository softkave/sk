import { find } from "lodash";
import { IRoom } from "../../models/chat/types";
import { IAppState } from "../types";

function getRoom(state: IAppState, roomId: string) {
  return state.rooms[roomId];
}

function getRoomByRecipientId(state: IAppState, recipientId: string) {
  return find(state.rooms, (room) => room.recipientId === recipientId);
}

// TODO: should we cache the org room ids in the orgs for faster load?
function getOrgRooms(state: IAppState, orgId: string) {
  return Object.keys(state.rooms).reduce((rooms, id) => {
    if (state.rooms[id].workspaceId === orgId) {
      rooms.push(state.rooms[id]);
    }

    return rooms;
  }, [] as IRoom[]);
}

export default class RoomSelectors {
  static getRoom = getRoom;
  static getOrgRooms = getOrgRooms;
  static getRoomByRecipientId = getRoomByRecipientId;
}
