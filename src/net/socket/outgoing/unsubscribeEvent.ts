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
import { getSocketRoomInfo, getSocketRoomName } from "../roomNameHelpers";
import SocketAPI from "../socket";

export default async function unsubcribeEvent(
  items?: ClientSubscribedResources
) {
  const roomsToRemove: string[] = [];
  const rooms =
    KeyValueSelectors.getKey(
      store.getState(),
      KeyValueKeys.RoomsSubscribedTo
    ) || {};

  if (!items) {
    // Unsubscribe from all the rooms if no argument is provided
    const roomSignatures = Object.keys(rooms);
    items = roomSignatures.map((signature) =>
      getSocketRoomInfo(signature)
    ) as ClientSubscribedResources;
  } else {
    // Filter out rooms not found in the store
    // This prevents double "un-subscription" on logout.
    // The logout action unsubscribes all resources, and individual
    // components do too. This makes sure we don't unsubscribe twice.
    items = items.filter((item) => {
      const roomId = getSocketRoomName(item);
      return !!rooms[roomId];
    });
  }

  if (items.length === 0) {
    return;
  }

  const data: IOutgoingSubscribePacket = { items };
  const promise = SocketAPI.promisifiedEmit(
    OutgoingSocketEvents.Unsubscribe,
    data
  );

  items.forEach((item) => {
    const roomId = getSocketRoomName(item);

    if (rooms[roomId]) {
      roomsToRemove.push(roomId);
    }
  });

  store.dispatch(KeyValueActions.removeRooms(roomsToRemove));
  return promise;
}
