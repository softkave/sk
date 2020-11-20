import KeyValueActions from "../../../redux/key-value/actions";
import KeyValueSelectors from "../../../redux/key-value/selectors";
import {
    ClientSubscribedResources,
    KeyValueKeys,
} from "../../../redux/key-value/types";
import store from "../../../redux/store";
import {
    IOutgoingSubscribePacket,
    OutgoingSocketEvents,
} from "../outgoingEventTypes";
import SocketAPI from "../socket";

export default function unsubcribeEvent(items: ClientSubscribedResources) {
    if (SocketAPI.socket && items.length > 0) {
        const data: IOutgoingSubscribePacket = { items };
        const roomsToRemove: string[] = [];
        SocketAPI.socket.emit(OutgoingSocketEvents.Unsubscribe, data);

        const rooms =
            KeyValueSelectors.getKey(
                store.getState(),
                KeyValueKeys.RoomsSubscribedTo
            ) || {};

        items.forEach((item) => {
            const roomId = `${item.type}-${item.customId}`;

            if (rooms[roomId]) {
                roomsToRemove.push(roomId);
            }
        });

        store.dispatch(KeyValueActions.removeRooms(roomsToRemove));
    }
}
