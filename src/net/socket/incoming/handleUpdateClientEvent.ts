import SessionActions from "../../../redux/session/actions";
import { IStoreLikeObject } from "../../../redux/types";
import { IIncomingUpdateClientPacket } from "../incomingEventTypes";

export default function handleUpdateClientEvent(
    store: IStoreLikeObject,
    data: IIncomingUpdateClientPacket
) {
    if (data && !data.errors) {
        store.dispatch(SessionActions.updateClient(data.client));
    }
}
