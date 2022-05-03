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
import { getSocketRoomName } from "../roomNameHelpers";
import SocketAPI from "../socket";

export default function subscribeEvent(items: ClientSubscribedResources) {
  if (items.length > 0) {
    const data: IOutgoingSubscribePacket = { rooms: items };
    const roomsToPush: string[] = [];
    SocketAPI.promisifiedEmit(OutgoingSocketEvents.Subscribe, data).then(() => {
      const rooms =
        KeyValueSelectors.getKey<ClientSubscribedResources>(
          store.getState(),
          KeyValueKeys.RoomsSubscribedTo
        ) || {};

      items.forEach((item) => {
        const roomSignature = getSocketRoomName(item);

        if (!rooms[roomSignature]) {
          roomsToPush.push(roomSignature);
        }
      });

      store.dispatch(KeyValueActions.pushRooms(roomsToPush));
    });
  }
}
