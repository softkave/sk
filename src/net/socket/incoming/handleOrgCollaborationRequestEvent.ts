import NotificationSelectors from "../../../redux/notifications/selectors";
import { updateNotificationStatus } from "../../../redux/operations/notification/respondToNotification";
import store from "../../../redux/store";
import { IIncomingNewNotificationsPacket } from "../incomingEventTypes";

export default function handleOrgCollaborationRequestEvent(
    data: IIncomingNewNotificationsPacket
) {
    if (!data.data) {
        return;
    }

    const innerData = data.data;
    const notification = NotificationSelectors.getNotification(
        store.getState(),
        innerData.customId
    );

    store.dispatch(
        updateNotificationStatus({
            request: notification,
            response: innerData.response,
        })
    );
}
