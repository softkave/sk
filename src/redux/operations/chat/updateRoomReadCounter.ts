import ChatAPI, {
  IUpdateRoomReadCounterAPIParameters,
} from "../../../net/chat/chat";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString } from "../../../utils/utils";
import RoomActions from "../../rooms/actions";
import RoomSelectors from "../../rooms/selectors";
import SessionSelectors from "../../session/selectors";
import { IStoreLikeObject } from "../../types";
import { makeAsyncOp02NoPersist } from "../utils";
import { updateUnseenChatsCountLocalOpAction } from "./updateUnseenChatsCountLocal";

export const updateRoomReadCounterOpAction = makeAsyncOp02NoPersist(
  "op/chat/updateRoomReadCounter",
  async (arg: IUpdateRoomReadCounterAPIParameters, thunkAPI, extras) => {
    let readCounter = arg.readCounter || getDateString();

    if (!extras.isDemoMode) {
      const result = await ChatAPI.updateRoomReadCounter({
        orgId: arg.orgId,
        readCounter: arg.readCounter,
        roomId: arg.roomId,
      });

      assertEndpointResult(result);
      readCounter = result.readCounter;
    }

    completeUpdateRoomReadCounter(thunkAPI, arg.roomId, readCounter);
  }
);

export function completeUpdateRoomReadCounter(
  thunkAPI: IStoreLikeObject,
  roomId: string,
  readCounter: string
) {
  const user = SessionSelectors.assertGetUser(thunkAPI.getState());
  const room = RoomSelectors.getRoom(thunkAPI.getState(), roomId);
  thunkAPI.dispatch(
    RoomActions.updateRoom({
      id: roomId,
      data: {
        members: room.members.map((member) => {
          if (member.userId === user.customId) {
            return {
              ...member,
              readCounter,
            };
          }

          return member;
        }),
      },
    })
  );
  thunkAPI.dispatch(updateUnseenChatsCountLocalOpAction({ roomId, count: 0 }));
}
