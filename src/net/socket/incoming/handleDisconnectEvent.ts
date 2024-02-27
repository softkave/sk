import KeyValueActions from "../../../redux/key-value/actions";
import { KeyValueKeys } from "../../../redux/key-value/types";
import SessionSelectors from "../../../redux/session/selectors";
import { IStoreLikeObject } from "../../../redux/types";
import SocketAPI from "../socket";

export default function handleDisconnectEvent(store: IStoreLikeObject) {
  SocketAPI.authCompleted = false;
  if (SocketAPI.authFailed) {
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
