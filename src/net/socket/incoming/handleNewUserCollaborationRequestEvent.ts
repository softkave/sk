import { storeUserNotifications } from "../../../redux/operations/notification/loadUserNotifications";
import { IStoreLikeObject } from "../../../redux/types";
import { IIncomingNewNotificationsPacket } from "../incomingEventTypes";

export default function handleUserCollaborationRequestsEvent(
    store: IStoreLikeObject,
    data: IIncomingNewNotificationsPacket
) {
    if (data && data.errors) {
        return;
    }

    storeUserNotifications(store, data.notifications);
}
