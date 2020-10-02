import { IRoom } from "../../models/chat/types";
import { IAppState } from "../types";

function getRoom(state: IAppState, roomId: string) {
    return state.rooms[roomId];
}

// TODO: should we cache the org room ids in the orgs for faster load?
function getOrgRooms(state: IAppState, orgId: string) {
    return Object.keys(state.rooms).reduce((rooms, id) => {
        if (state.rooms[id].orgId === orgId) {
            rooms.push(state.rooms[id]);
        }

        return rooms;
    }, [] as IRoom[]);
}

function getRoomChatsCount(
    state: IAppState,
    roomId: string,
    recipientId: string
) {
    let rm = state.rooms[roomId];

    if (!rm) {
        const rmId = Object.keys(state).find((id) => {
            return state[id].recipientId === recipientId;
        })!;
        rm = state[rmId];
    }

    return rm?.chats.length;
}

export default class RoomSelectors {
    public static getRoom = getRoom;
    public static getOrgRooms = getOrgRooms;
    public static getRoomChatsCount = getRoomChatsCount;
}
