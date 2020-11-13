import { getRoomFromPersistedRoom } from "../../../models/chat/utils";
import KeyValueActions from "../../../redux/key-value/actions";
import RoomActions from "../../../redux/rooms/actions";
import RoomSelectors from "../../../redux/rooms/selectors";
import SessionSelectors from "../../../redux/session/selectors";
import store from "../../../redux/store";
import { getNewTempId } from "../../../utils/utils";
import { IIncomingNewRoomPacket } from "../incomingEventTypes";

export default function handleNewRoomEvent(data: IIncomingNewRoomPacket) {
    if (!data.data) {
        return;
    }

    const innerData = data.data;
    const persistedRoom = innerData.room;
    const user = SessionSelectors.assertGetUser(store.getState());
    const recipientMemberData = persistedRoom.members.find(
        (member) => member.userId !== user.customId
    )!;

    const recipientId = recipientMemberData.userId;
    const tempRoomId = getNewTempId(recipientId);
    const tempRoom = RoomSelectors.getRoom(store.getState(), tempRoomId);

    if (tempRoom) {
        persistedRoom.members = tempRoom.members;
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
            // TODO: this shouldn't happen, log it to the server
            persistedRoom.members = existingRoom.members;
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
