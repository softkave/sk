import assert from "assert";
import { isUserViewingChatRoom } from "../../../models/app/routes";
import { SystemActionType } from "../../../models/app/types";
import { IChat } from "../../../models/chat/types";
import KeyValueSelectors from "../../../redux/key-value/selectors";
import { KeyValueKeys } from "../../../redux/key-value/types";
import { updateUnseenChatsCountLocalOpAction } from "../../../redux/operations/chat/updateUnseenChatsCountLocal";
import RoomActions from "../../../redux/rooms/actions";
import RoomSelectors from "../../../redux/rooms/selectors";
import SessionSelectors from "../../../redux/session/selectors";
import store from "../../../redux/store";
import { IIncomingResourceUpdatePacket } from "../incomingEventTypes";

function handleCreateChat(packet: IIncomingResourceUpdatePacket<IChat>) {
  const chat = packet.resource;
  const user = SessionSelectors.assertGetUser(store.getState());
  const room = RoomSelectors.getRoom(store.getState(), chat.roomId);
  assert(room, "Room does not exist");
  const isUserInRoom = isUserViewingChatRoom(room.orgId, room.recipientId);
  const isAppHidden = KeyValueSelectors.getKey<boolean>(
    store.getState(),
    KeyValueKeys.IsAppHidden
  );
  const markAsUnread =
    (!isUserInRoom || isAppHidden) && chat.sender !== user.customId;

  // Add chat to room
  store.dispatch(
    RoomActions.addChat({
      chat,
      roomId: room.customId,
    })
  );

  if (markAsUnread) {
    store.dispatch(
      updateUnseenChatsCountLocalOpAction({
        roomId: room.customId,
        count: room.unseenChatsCount + 1,
      })
    );
  }
}

export function handleIncomingChatEvent(
  packet: IIncomingResourceUpdatePacket<IChat>
) {
  switch (packet.actionType) {
    case SystemActionType.Create:
      handleCreateChat(packet);
      break;
  }
}
