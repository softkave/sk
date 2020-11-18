import { storeOrgNotifications } from "../../../redux/operations/block/loadOrgData";
import { IStoreLikeObject } from "../../../redux/types";
import { IIncomingNewNotificationsPacket } from "../incomingEventTypes";

export default function handleOrgCollaborationRequestsEvent(
    store: IStoreLikeObject,
    data: IIncomingNewNotificationsPacket
) {
    if (!data.errors) {
        return;
    }

    storeOrgNotifications(
        store,
        data.notifications[0].from?.blockId,
        data.notifications
    );
}
