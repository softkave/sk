import { IStoreLikeObject } from "../../../redux/types";
import { IIncomingUserUpdatePacket } from "../incomingEventTypes";

export default function handleUserUpdateEvent(
    store: IStoreLikeObject,
    data: IIncomingUserUpdatePacket
) {
    // TODO: most likely not needed anymore
}
