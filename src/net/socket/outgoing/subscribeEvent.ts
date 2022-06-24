import assert from "assert";
import * as yup from "yup";
import KeyValueActions from "../../../redux/key-value/actions";
import KeyValueSelectors from "../../../redux/key-value/selectors";
import {
  ClientSubscribedResources,
  KeyValueKeys,
} from "../../../redux/key-value/types";
import store from "../../../redux/store";
import { endpointYupOptions } from "../../utils";
import {
  IOutgoingSubscribePacket,
  OutgoingSocketEvents,
} from "../outgoingEventTypes";
import { getSocketRoomName } from "../roomNameHelpers";
import SocketAPI from "../socket";

export const roomItemsYupSchema = yup.array().of(
  yup.object().shape({
    customId: yup.string(),
    type: yup.string(),
    subRoom: yup.string(),
  })
);

export default function subscribeEvent(items: ClientSubscribedResources) {
  items = roomItemsYupSchema.validateSync(
    items,
    endpointYupOptions
  ) as ClientSubscribedResources;

  assert(items);
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
