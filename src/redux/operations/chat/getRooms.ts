import { SystemResourceType } from "../../../models/app/types";
import { IRoom } from "../../../models/chat/types";
import { getRoomFromPersistedRoom } from "../../../models/chat/utils";
import ChatAPI, { IGetRoomsEndpointParameters } from "../../../net/chat/chat";
import subscribeEvent from "../../../net/socket/outgoing/subscribeEvent";
import { assertEndpointResult } from "../../../net/utils";
import { indexArray } from "../../../utils/utils";
import RoomActions from "../../rooms/actions";
import SessionSelectors from "../../session/selectors";
import { makeAsyncOp02, removeAsyncOp02Params } from "../utils";

// TODO: get unseen chats count
export const getRoomsOpAction = makeAsyncOp02(
  "op/chat/getRooms",
  async (arg: IGetRoomsEndpointParameters, thunkAPI, extras) => {
    let rooms: IRoom[] = [];
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());

    if (!extras.isDemoMode) {
      // Fetch chat rooms
      const roomsResult = await ChatAPI.getRooms(removeAsyncOp02Params(arg));
      assertEndpointResult(roomsResult);

      // Fetch rooms unseen chats count
      const countsResult = await ChatAPI.getRoomsUnseenChatsCount({
        orgId: arg.orgId,
        roomIds: roomsResult.rooms.map((r) => r.customId),
      });
      assertEndpointResult(countsResult);

      // Merge rooms and counts
      const countsMap = indexArray(countsResult.counts, { path: "roomId" });
      rooms = roomsResult.rooms.map((room) =>
        getRoomFromPersistedRoom(room, user.customId, {
          unseenChatsCount: countsMap[room.customId]?.count || 0,
        })
      );
    }

    thunkAPI.dispatch(RoomActions.bulkAddRooms(rooms));
    subscribeEvent(
      rooms.map((room) => ({
        customId: room.customId,
        type: SystemResourceType.Room,
      }))
    );
  }
);
