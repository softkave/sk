import { SystemResourceType } from "../../../models/app/types";
import { IRoom } from "../../../models/chat/types";
import {
  getRoomFromPersistedRoom,
  getTempRoomId,
} from "../../../models/chat/utils";
import ChatAPI, { IAddRoomEndpointParameters } from "../../../net/chat/chat";
import { getSocketRoomName } from "../../../net/socket/roomNameHelpers";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString } from "../../../utils/utils";
import RoomActions from "../../rooms/actions";
import SessionSelectors from "../../session/selectors";
import { makeAsyncOp02NoPersist, removeAsyncOp02Params } from "../utils";

export const addRoomOpAction = makeAsyncOp02NoPersist(
  "op/chat/addRoom",
  async (arg: IAddRoomEndpointParameters, thunkAPI, extras) => {
    let room: IRoom;
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());

    if (extras.isDemoMode) {
      const tempRoomId = getTempRoomId(arg.orgId, arg.recipientId);
      room = {
        orgId: arg.orgId,
        customId: tempRoomId,
        name: getSocketRoomName({
          customId: tempRoomId,
          type: SystemResourceType.Room,
        }),
        createdAt: getDateString(),
        createdBy: user.customId,
        members: [
          { userId: user.customId, readCounter: getDateString() },
          { userId: arg.recipientId, readCounter: getDateString() },
        ],
        recipientId: arg.recipientId,
        unseenChatsStartIndex: null,
        unseenChatsCount: 0,
        chats: [],
      };
    } else {
      const result = await ChatAPI.addRoom(removeAsyncOp02Params(arg));
      assertEndpointResult(result);
      room = getRoomFromPersistedRoom(result.room, user.customId);
    }

    thunkAPI.dispatch(RoomActions.addRoom(room));
  }
);
