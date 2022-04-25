import assert from "assert";
import { isUserViewingChatRoom } from "../../../models/app/routes";
import { SystemActionType } from "../../../models/app/types";
import { IChat } from "../../../models/chat/types";
import KeyValueActions from "../../../redux/key-value/actions";
import KeyValueSelectors from "../../../redux/key-value/selectors";
import { KeyValueKeys } from "../../../redux/key-value/types";
import RoomActions from "../../../redux/rooms/actions";
import RoomSelectors from "../../../redux/rooms/selectors";
import store from "../../../redux/store";
import { IIncomingResourceUpdatePacket } from "../incomingEventTypes";

function handleCreateChat(packet: IIncomingResourceUpdatePacket<IChat>) {
  const chat = packet.resource;
  const room = RoomSelectors.getRoom(store.getState(), chat.roomId);
  assert(room, "Room does not exist");
  const isUserInRoom = isUserViewingChatRoom(room.orgId, room.recipientId);
  const isAppHidden = KeyValueSelectors.getKey<boolean>(
    store.getState(),
    KeyValueKeys.IsAppHidden
  );

  // Add chat to room
  store.dispatch(
    RoomActions.addChat({
      chat,
      roomId: room.customId,
      recipientId: room.recipientId,
      markAsUnseen: !isUserInRoom || isAppHidden,
      orgId: room.orgId,
    })
  );

  if (isUserInRoom) {
    return;
  }

  // Update org unseen chats count
  const unseenChatsCountMapByOrg = KeyValueSelectors.getKey(
    store.getState(),
    KeyValueKeys.UnseenChatsCountByOrg
  );

  const orgUnseenChatsCount = (unseenChatsCountMapByOrg[chat.orgId] || 0) + 1;
  store.dispatch(
    KeyValueActions.setKey({
      key: KeyValueKeys.UnseenChatsCountByOrg,
      value: {
        ...unseenChatsCountMapByOrg,
        [chat.orgId]: orgUnseenChatsCount,
      },
    })
  );
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
