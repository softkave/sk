import delay from "lodash/delay";
import { getRoomLikeResource } from "../../../models/rooms/utils";
import KeyValueActions from "../../../redux/key-value/actions";
import KeyValueSelectors from "../../../redux/key-value/selectors";
import {
    ClientSubscribedResources,
    KeyValueKeys,
} from "../../../redux/key-value/types";
import { IStoreLikeObject } from "../../../redux/types";
import { GetEndpointResult } from "../../types";
import fetchMissingBroadcastsEvent from "../outgoing/fetchMissingBroadcastsEvent";
import subscribeEvent from "../outgoing/subscribeEvent";
import SocketAPI from "../socket";
import handleFetchMissingBroadcastsEvent from "./handleFetchMissingBroadcastsEvent";

export default async function handleAuthEvent(
    store: IStoreLikeObject,
    data: GetEndpointResult<{}>
) {
    if (data.errors) {
        SocketAPI.connFailedBefore = true;

        // TODO: maybe show notification
        const tenSecsInMs = 10000;
        delay(() => {
            SocketAPI.disconnectSocket();
        }, tenSecsInMs);

        SocketAPI.flushWaitQueue(null);
        return;
    }

    SocketAPI.authCompleted = true;
    SocketAPI.flushWaitQueue(SocketAPI.socket);

    const rooms =
        KeyValueSelectors.getKey(
            store.getState(),
            KeyValueKeys.RoomsSubscribedTo
        ) || {};

    const roomSignatures = Object.keys(rooms);
    const items = roomSignatures.map((signature) =>
        getRoomLikeResource(signature)
    ) as ClientSubscribedResources;

    subscribeEvent(items);

    const socketDisconnectedAt = KeyValueSelectors.getKey(
        store.getState(),
        KeyValueKeys.SocketDisconnectedAt
    );

    if (socketDisconnectedAt) {
        store.dispatch(
            KeyValueActions.setKey({
                key: KeyValueKeys.FetchingMissingBroadcasts,
                value: true,
            })
        );

        const packet = await fetchMissingBroadcastsEvent(
            socketDisconnectedAt as number,
            roomSignatures
        );

        handleFetchMissingBroadcastsEvent(store, packet);

        store.dispatch(
            KeyValueActions.setKey({
                key: KeyValueKeys.FetchingMissingBroadcasts,
                value: false,
            })
        );
    }
}
