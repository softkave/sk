import delay from "lodash/delay";
import KeyValueActions from "../../../redux/key-value/actions";
import KeyValueSelectors from "../../../redux/key-value/selectors";
import { ClientSubscribedResources, KeyValueKeys } from "../../../redux/key-value/types";
import { IStoreLikeObject } from "../../../redux/types";
import { devError } from "../../../utils/log";
import { GetEndpointResult } from "../../types";
import subscribeEvent from "../outgoing/subscribeEvent";
import updateSocketEntryEvent from "../outgoing/updateSocketEntryEvent";
import { getSocketRoomInfo } from "../roomNameHelpers";
import SocketAPI from "../socket";

export default async function handleAuthEvent(
  store: IStoreLikeObject,
  data: GetEndpointResult<{}>
) {
  if (data && data.errors) {
    SocketAPI.authFailed = true;

    // TODO: maybe show notification
    const tenSecsInMs = 10000;

    // TODO: why are we delaying the disconnect call?
    delay(() => {
      SocketAPI.disconnectSocket();
      SocketAPI.flushWaitQueue();
    }, tenSecsInMs);

    return;
  }

  SocketAPI.authCompleted = true;
  SocketAPI.flushWaitQueue();
  store.dispatch(
    KeyValueActions.setKey({
      key: KeyValueKeys.SocketConnected,
      value: true,
    })
  );

  const isInactive = KeyValueSelectors.getByKey(store.getState(), KeyValueKeys.IsAppHidden);
  updateSocketEntryEvent({
    isActive: !isInactive,
  }).catch(devError);

  const rooms = KeyValueSelectors.getByKey(store.getState(), KeyValueKeys.RoomsSubscribedTo) || {};
  const roomSignatures = Object.keys(rooms);
  const items = roomSignatures.map((signature) =>
    getSocketRoomInfo(signature)
  ) as ClientSubscribedResources;

  subscribeEvent(items);
}
