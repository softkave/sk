import assert from "assert";
import { IRoom } from "../../../models/chat/types";
import OrganizationActions from "../../organizations/actions";
import OrganizationSelectors from "../../organizations/selectors";
import RoomActions from "../../rooms/actions";
import RoomSelectors from "../../rooms/selectors";
import { makeAsyncOp02NoPersist } from "../utils";

export const updateUnseenChatsCountLocalOpAction = makeAsyncOp02NoPersist(
  "op/chat/updateUnseenChatsCountLocal",
  async (arg: { roomId: string; count: number }, thunkAPI) => {
    const room: IRoom = RoomSelectors.getRoom(thunkAPI.getState(), arg.roomId);
    assert(room, "Room not found");
    const organization = OrganizationSelectors.assertGetOne(
      thunkAPI.getState(),
      room.orgId
    );
    thunkAPI.dispatch(
      OrganizationActions.update({
        id: organization.customId,
        data: {
          unseenChatsCount: organization.unseenChatsCount
            ? organization.unseenChatsCount - room.unseenChatsCount + arg.count
            : arg.count,
        },
      })
    );
    thunkAPI.dispatch(
      RoomActions.updateRoom({
        id: arg.roomId,
        data: {
          unseenChatsCount: arg.count,
        },
      })
    );
  }
);
