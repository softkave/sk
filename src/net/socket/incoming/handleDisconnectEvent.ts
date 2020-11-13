import KeyValueActions from "../../../redux/key-value/actions";
import { KeyValueKeys } from "../../../redux/key-value/types";
import SessionSelectors from "../../../redux/session/selectors";
import store from "../../../redux/store";

export default function handleDisconnectEvent() {
    // TODO: should we set to null, won't that prevent reconnection
    // because it will be garbage collected
    // socket = null;
    socketAuthCompleted = false;

    if (connectionFailedBefore) {
        return;
    }

    const socketDisconnectedAt = Date.now();
    const isUserLoggedIn = SessionSelectors.isUserSignedIn(store.getState());

    if (isUserLoggedIn) {
        store.dispatch(
            KeyValueActions.setKey({
                key: KeyValueKeys.SocketDisconnectedAt,
                value: socketDisconnectedAt,
            })
        );
    }
}
