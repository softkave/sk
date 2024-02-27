import { SystemResourceType } from "../../../models/app/types";
import { IRoom } from "../../../models/chat/types";
import { getRoomFromPersistedRoom } from "../../../models/chat/utils";
import ChatAPI, { IGetRoomsEndpointParameters } from "../../../net/chat/chat";
import subscribeEvent from "../../../net/socket/outgoing/subscribeEvent";
import { assertEndpointResult } from "../../../net/utils";
import RoomActions from "../../rooms/actions";
import SessionSelectors from "../../session/selectors";
import { makeAsyncOp02, removeAsyncOp02Params } from "../utils";
import { getRoomsUnseenChatsCountOpAction } from "./getRoomsUnseenChatsCount";

export const getRoomsOpAction = makeAsyncOp02(
  "op/chat/getRooms",
  async (arg: IGetRoomsEndpointParameters, thunkAPI, extras) => {
    let rooms: IRoom[] = [];
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());
    if (!extras.isDemoMode) {
      // Fetch chat rooms
      const roomsResult = await ChatAPI.getRooms(removeAsyncOp02Params(arg));
      assertEndpointResult(roomsResult);
      rooms = roomsResult.rooms.map((room) => getRoomFromPersistedRoom(room, user.customId));
    }

    thunkAPI.dispatch(RoomActions.bulkAddRooms(rooms));
    thunkAPI.dispatch(
      getRoomsUnseenChatsCountOpAction({
        orgId: arg.orgId,
        roomIds: rooms.map((room) => room.customId),
      })
    );
    subscribeEvent(
      rooms.map((room) => ({
        customId: room.customId,
        type: SystemResourceType.ChatRoom,
      }))
    );
  }
);
