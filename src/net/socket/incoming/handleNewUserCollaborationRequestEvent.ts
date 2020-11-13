export default function handleUserCollaborationRequestEvent(
    data: IUserCollaborationRequestResponsePacket
) {
    const notification = NotificationSelectors.getNotification(
        store.getState(),
        data.customId
    );

    store.dispatch(
        completeUserNotificationResponse({
            request: notification,
            response: data.response,
            block: data.org,
        })
    );
}
