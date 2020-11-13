import delay from "lodash/delay";
import { getRoomLikeResource } from "../../../models/rooms/utils";
import KeyValueActions from "../../../redux/key-value/actions";
import KeyValueSelectors from "../../../redux/key-value/selectors";
import {
    ClientSubscribedResources,
    KeyValueKeys,
} from "../../../redux/key-value/types";
import store from "../../../redux/store";
import {
    fetchMissingBroadcasts,
    handleFetchMissingBroadcastsResponse,
    subscribe,
} from "../socket";
import { IIncomingSocketEventPacket } from "../types";

export default async function handleAuthEvent(
    data: IIncomingSocketEventPacket<void>
) {
    if (data.errors) {
        connectionFailedBefore = true;

        // TODO: maybe show notification
        const tenSecsInMs = 10000;
        delay(() => {
            socket?.disconnect();
        }, tenSecsInMs);

        clearSocketWaitQueue(null);
        return;
    }

    socketAuthCompleted = true;
    clearSocketWaitQueue(socket);

    const rooms =
        KeyValueSelectors.getKey(
            store.getState(),
            KeyValueKeys.RoomsSubscribedTo
        ) || {};

    const roomSignatures = Object.keys(rooms);
    const items = roomSignatures.map((signature) =>
        getRoomLikeResource(signature)
    ) as ClientSubscribedResources;

    subscribe(items);

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

        const packet = await fetchMissingBroadcasts(
            socketDisconnectedAt as number,
            roomSignatures
        );

        handleFetchMissingBroadcastsResponse(packet);
        store.dispatch(
            KeyValueActions.setKey({
                key: KeyValueKeys.FetchingMissingBroadcasts,
                value: false,
            })
        );
    }
}
