import { IStoreLikeObject } from "../../../redux/types";
import { IOutgoingEventPacket, OutgoingSocketEvents } from "../outgoingEventTypes";
import SocketAPI from "../socket";
import handleAuthEvent from "./handleAuthEvent";

export default function handleConnectEvent(
  store: IStoreLikeObject,
  token: string,
  clientId: string
) {
  const authData: IOutgoingEventPacket = { token, clientId };
  SocketAPI.socket?.emit(OutgoingSocketEvents.Auth, authData, (data) => {
    handleAuthEvent(store, data);
  });
}
