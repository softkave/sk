import RoomActions from "../../../redux/rooms/actions";
import RoomSelectors from "../../../redux/rooms/selectors";
import SessionSelectors from "../../../redux/session/selectors";
import store from "../../../redux/store";
import { IIncomingUpdateRoomReadCounterPacket } from "../incomingEventTypes";

export default function handleUpdateRoomReadCounterEvent(
    data: IIncomingUpdateRoomReadCounterPacket
) {
    if (data.data) {
        const innerData = data.data;
        const user = SessionSelectors.assertGetUser(store.getState());
        const room = RoomSelectors.getRoom(store.getState(), innerData.roomId);

        if (!room) {
            // TODO: log something to the log server
            return;
        }

        store.dispatch(
            RoomActions.updateRoomReadCounter({
                roomId: room.customId,
                userId: innerData.member.userId,
                readCounter: innerData.member.readCounter,
                isSignedInUser: user.customId === innerData.member.userId,
            })
        );
    }
}
