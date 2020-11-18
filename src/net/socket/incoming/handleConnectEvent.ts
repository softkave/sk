import { IStoreLikeObject } from "../../../redux/types";
import { OutgoingSocketEvents } from "../outgoingEventTypes";
import SocketAPI from "../socket";
import { IOutgoingSocketEventPacket } from "../types";
import handleAuthEvent from "./handleAuthEvent";

export default function handleConnectEvent(
    store: IStoreLikeObject,
    token: string
) {
    const authData: IOutgoingSocketEventPacket = { token };
    SocketAPI.socket?.emit(OutgoingSocketEvents.Auth, authData, (data) =>
        handleAuthEvent(store, data)
    );
}
