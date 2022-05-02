import assert from "assert";
import { IChat } from "../../../models/chat/types";
import ChatAPI, {
  ISendMessageEndpointParameters,
} from "../../../net/chat/chat";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString, getNewTempId } from "../../../utils/utils";
import RoomActions from "../../rooms/actions";
import RoomSelectors from "../../rooms/selectors";
import SessionSelectors from "../../session/selectors";
import { makeAsyncOp02NoPersist, removeAsyncOpParams } from "../utils";

export const sendMessageOpAction = makeAsyncOp02NoPersist(
  "op/chat/sendMessage",
  async (arg: ISendMessageEndpointParameters, thunkAPI, extras) => {
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());
    let room = RoomSelectors.getRoom(thunkAPI.getState(), arg.roomId);
    assert(room, "Room not found");
    let chat: IChat = {
      customId: getNewTempId(),
      orgId: arg.orgId,
      message: arg.message,
      sender: user.customId,
      roomId: arg.roomId,
      createdAt: getDateString(),
      sending: true,
    };
    thunkAPI.dispatch(
      RoomActions.addChat({
        chat,
        roomId: arg.roomId,
      })
    );
    room = RoomSelectors.getRoom(thunkAPI.getState(), arg.roomId);
    const index = room.chats.length - 1;
    assert(room.chats[index].customId === chat.customId);

    if (!extras.isDemoMode) {
      const result = await ChatAPI.sendMessage(removeAsyncOpParams(arg));
      assertEndpointResult(result);
      chat = result.chat;
    }

    chat.sending = false;
    thunkAPI.dispatch(
      RoomActions.updateChat({
        roomId: arg.roomId,
        chatIndex: index,
        data: chat,
      })
    );
  }
);
