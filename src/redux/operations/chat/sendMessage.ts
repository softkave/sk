import assert from "assert";
import { SystemResourceType } from "../../../models/app/types";
import { IChat } from "../../../models/chat/types";
import ChatAPI, { ISendMessageEndpointParameters } from "../../../net/chat/chat";
import { getNewId, getNewId02 } from "../../../utils/ids";
import { getDateString } from "../../../utils/utils";
import RoomActions from "../../rooms/actions";
import RoomSelectors from "../../rooms/selectors";
import SessionSelectors from "../../session/selectors";
import { makeAsyncOp02NoPersist, removeAsyncOp02Params } from "../utils";

export const sendMessageOpAction = makeAsyncOp02NoPersist(
  "op/chat/sendMessage",
  async (arg: ISendMessageEndpointParameters, thunkAPI, extras) => {
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());
    let room = RoomSelectors.getRoom(thunkAPI.getState(), arg.roomId);
    assert(room, "Room not found");
    let chat: IChat = {
      customId: getNewId02(SystemResourceType.Temporary),
      workspaceId: arg.orgId,
      message: arg.message,
      createdBy: user.customId,
      roomId: arg.roomId,
      createdAt: getDateString(),
      sending: true,
      localId: arg.localId || getNewId(),
      visibility: "organization",
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
      arg.localId = chat.localId;
      const result = await ChatAPI.sendMessage(removeAsyncOp02Params(arg));
      if (result.errors) {
        chat.errorMessage = "Error sending message";
      } else {
        chat = { ...chat, ...result.chat };
      }
    }

    chat.sending = false;
    assert(chat.localId, "Chat localId not found");
    thunkAPI.dispatch(
      RoomActions.updateChat({
        roomId: arg.roomId,
        localId: chat.localId,
        data: chat,
      })
    );
  }
);
