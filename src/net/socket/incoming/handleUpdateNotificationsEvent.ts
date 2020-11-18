import NotificationActions from "../../../redux/notifications/actions";
import { IStoreLikeObject } from "../../../redux/types";
import { IIncomingUpdateNotificationsPacket } from "../incomingEventTypes";

export default function handleUpdateNotificationsEvent(
    store: IStoreLikeObject,
    data: IIncomingUpdateNotificationsPacket
) {
    if (data.notifications) {
        store.dispatch(
            NotificationActions.bulkUpdateNotifications(data.notifications)
        );
    }
}
