export default function handleUpdateNotificationsEvent(
    data: IUpdateNotificationPacket
) {
    store.dispatch(
        NotificationActions.updateNotification({
            id: data.customId,
            data: { readAt: data.data.readAt },
            meta: {
                arrayUpdateStrategy: "replace",
            },
        })
    );
}
