import KeyValueActions from "../../../redux/key-value/actions";
import KeyValueSelectors from "../../../redux/key-value/selectors";
import { KeyValueKeys } from "../../../redux/key-value/types";
import { RoomDoesNotExistError } from "../../../redux/operations/chat/sendMessage";
import RoomActions from "../../../redux/rooms/actions";
import RoomSelectors from "../../../redux/rooms/selectors";
import store from "../../../redux/store";
import { IIncomingSendMessagePacket } from "../incomingEventTypes";

export default function handleNewMessageEvent(
    data: IIncomingSendMessagePacket
) {
    if (!data.data) {
        return;
    }

    const innerData = data.data;
    const chat = innerData.chat;
    const room = RoomSelectors.getRoom(store.getState(), chat.roomId);

    if (!room) {
        throw new RoomDoesNotExistError();
    }

    /**
     * path format is /app/orgs/:orgId/chat/:recipientId
     */
    const isUserInOrg = window.location.pathname.includes(room.orgId);
    const isUserInRoom =
        isUserInOrg && window.location.pathname.includes(room.recipientId);

    // Add chat to room
    store.dispatch(
        RoomActions.addChat({
            chat,
            roomId: room.customId,
            recipientId: room.recipientId,
            markAsUnseen: !isUserInRoom,
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
