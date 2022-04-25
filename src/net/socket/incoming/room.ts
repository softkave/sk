import { SystemActionType } from "../../../models/app/types";
import {
  getRoomFromPersistedRoom,
  getTempRoomId,
} from "../../../models/chat/utils";
import KeyValueActions from "../../../redux/key-value/actions";
import RoomActions from "../../../redux/rooms/actions";
import RoomSelectors from "../../../redux/rooms/selectors";
import SessionSelectors from "../../../redux/session/selectors";
import store from "../../../redux/store";
import { IPersistedRoom } from "../../chat/chat";
import { IIncomingResourceUpdatePacket } from "../incomingEventTypes";

function handleCreateRoom(
  packet: IIncomingResourceUpdatePacket<IPersistedRoom>
) {
  const persistedRoom = packet.resource;
  const user = SessionSelectors.assertGetUser(store.getState());
  const recipientMemberData = persistedRoom.members.find(
    (member) => member.userId !== user.customId
  )!;

  const recipientId = recipientMemberData.userId;
  const tempRoomId = getTempRoomId(persistedRoom.orgId, recipientId);
  const tempRoom = RoomSelectors.getRoom(store.getState(), tempRoomId);

  if (tempRoom) {
    // TODO: why are only updating the temp room and not replacing it?
    store.dispatch(
      RoomActions.updateRoom({
        id: tempRoom.customId,
        data: persistedRoom,
        meta: { arrayUpdateStrategy: "replace" },
      })
    );
  } else {
    const existingRoom = RoomSelectors.getRoom(
      store.getState(),
      persistedRoom.customId
    );

    if (existingRoom) {
      store.dispatch(
        RoomActions.updateRoom({
          id: existingRoom.customId,
          data: persistedRoom,
          meta: { arrayUpdateStrategy: "replace" },
        })
      );
    } else {
      store.dispatch(
        RoomActions.addRoom(
          getRoomFromPersistedRoom(persistedRoom, user.customId)
        )
      );
    }
  }

  store.dispatch(KeyValueActions.pushRooms([persistedRoom.name]));
}

export function handleIncomingRoomEvent(
  packet: IIncomingResourceUpdatePacket<IPersistedRoom>
) {
  switch (packet.actionType) {
    case SystemActionType.Create:
      handleCreateRoom(packet);
      break;
    case SystemActionType.Update:
      handleCreateRoom(packet);
      break;
  }
}
