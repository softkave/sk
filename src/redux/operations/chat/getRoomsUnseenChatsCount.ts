import ChatAPI, { IGetRoomsUnseenChatsCountEndpointParameters } from "../../../net/chat/chat";
import { assertEndpointResult } from "../../../net/utils";
import { indexArray } from "../../../utils/utils";
import RoomActions, { IUpdateRoomActionArgs } from "../../rooms/actions";
import { makeAsyncOp02NoPersist, removeAsyncOp02Params } from "../utils";

export const getRoomsUnseenChatsCountOpAction = makeAsyncOp02NoPersist(
  "op/chat/getRoomsUnseenChatsCount",
  async (arg: IGetRoomsUnseenChatsCountEndpointParameters, thunkAPI, extras) => {
    if (!extras.isDemoMode) {
      // Fetch rooms unseen chats count
      const countsResult = await ChatAPI.getRoomsUnseenChatsCount(removeAsyncOp02Params(arg));
      assertEndpointResult(countsResult);

      // Merge rooms and counts
      const countsMap = indexArray(countsResult.counts, { path: "roomId" });
      const updates: IUpdateRoomActionArgs[] = arg.roomIds.map((roomId) => ({
        id: roomId,
        data: {
          unseenChatsCount: countsMap[roomId]?.count || 0,
        },
      }));
      thunkAPI.dispatch(RoomActions.bulkUpdateRooms(updates));
    }
  }
);
