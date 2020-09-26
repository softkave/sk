import { IRoom } from "../../models/chat/types";
import { IAppState } from "../types";

function getRoom(state: IAppState, roomId: string) {
    return state.rooms[roomId];
}

function getRoomsAsArray(state: IAppState, ids: string[]) {
    return ids.reduce((rooms, id) => {
        if (state.rooms[id]) {
            rooms.push(state.rooms[id]);
        }

        return rooms;
    }, [] as IRoom[]);
}

export default class RoomSelectors {
    public static getRoom = getRoom;
    public static getRooms = getRoomsAsArray;
}
