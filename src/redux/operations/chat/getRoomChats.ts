import assert from "assert";
import { prepareRoomChats } from "../../../models/chat/utils";
import ChatAPI, {
  IGetRoomChatsEndpointParameters,
} from "../../../net/chat/chat";
import { assertEndpointResult } from "../../../net/utils";
import RoomActions from "../../rooms/actions";
import RoomSelectors from "../../rooms/selectors";
import { makeAsyncOp02, removeAsyncOp02Params } from "../utils";

export const getRoomChatsOpAction = makeAsyncOp02(
  "op/chat/getRoomChats",
  async (arg: IGetRoomChatsEndpointParameters, thunkAPI, extras) => {
    if (!extras.isDemoMode) {
      const result = await ChatAPI.getRoomChats(removeAsyncOp02Params(arg));
      assertEndpointResult(result);
      const room = RoomSelectors.getRoom(thunkAPI.getState(), arg.roomId);
      assert(room, "Room not found");
      prepareRoomChats(room, result.chats);
      thunkAPI.dispatch(
        RoomActions.updateRoom({
          id: room.customId,
          data: room,
          meta: { arrayUpdateStrategy: "replace" },
        })
      );
    }
  }
);
