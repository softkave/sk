export default function handleNewNotificationsEvent(
    data: INewNotificationsPacket
) {
    // TODO: alert the user of new notifications
    // either by a notification, message, or the red badge on Notifications
    // also, new notifications should have the new badge
    // update the user's notification check time if the user has notifications past the current time ( local )
    // update user's notification check time in the server when the user fetches notifications
    // and some are past the user's current time ( time sorted notifications )
    // add notification ids to the user's data
    // sort user's notifications on fetch, and sort the incoming, and add them to the rest
    store.dispatch(
        completeLoadUserNotifications({ notifications: data.notifications })
    );
}
