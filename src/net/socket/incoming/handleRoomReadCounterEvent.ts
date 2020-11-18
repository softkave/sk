import RoomActions from "../../../redux/rooms/actions";
import RoomSelectors from "../../../redux/rooms/selectors";
import SessionSelectors from "../../../redux/session/selectors";
import { IStoreLikeObject } from "../../../redux/types";
import { IIncomingUpdateRoomReadCounterPacket } from "../incomingEventTypes";

export default function handleUpdateRoomReadCounterEvent(
    store: IStoreLikeObject,
    data: IIncomingUpdateRoomReadCounterPacket
) {
    if (!data.errors) {
        const user = SessionSelectors.assertGetUser(store.getState());
        const room = RoomSelectors.getRoom(store.getState(), data.roomId);

        if (!room) {
            // TODO: log something to the log server
            return;
        }

        store.dispatch(
            RoomActions.updateRoomReadCounter({
                roomId: room.customId,
                userId: data.member.userId,
                readCounter: data.member.readCounter,
                isSignedInUser: user.customId === data.member.userId,
            })
        );
    }
}
