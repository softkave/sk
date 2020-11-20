import { getRoomId } from "../../../models/rooms/utils";
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

export default function subscribeEvent(items: ClientSubscribedResources) {
    if (SocketAPI.socket && items.length > 0) {
        const data: IOutgoingSubscribePacket = { items };
        const roomsToPush: string[] = [];

        SocketAPI.socket.emit(OutgoingSocketEvents.Subscribe, data);

        const rooms =
            KeyValueSelectors.getKey<ClientSubscribedResources>(
                store.getState(),
                KeyValueKeys.RoomsSubscribedTo
            ) || {};

        items.forEach((item) => {
            const roomSignature = getRoomId(item);

            if (!rooms[roomSignature]) {
                roomsToPush.push(roomSignature);
            }
        });

        store.dispatch(KeyValueActions.pushRooms(roomsToPush));
    }
}
