import { mergeDataByPath, setDataByPath } from "../../redux/actions/data";
import netInterface from "../../net/index";
import { makeMultiple } from "../../redux/actions/make";

export function makeNotificationHandlers({ dispatch }) {
  return {
    async onClickNotification(notification) {
      if (!notification.readAt) {
        let update = { readAt: Date.now() };

        await netInterface(
          "user.updateCollaborationRequest",
          notification,
          update
        );

        dispatch(
          mergeDataByPath(`notifications.${notification.customId}`, update)
        );
      }
    },

    async onRespond(notification, response) {
      function requestIsValid(statusHistory) {
        const invalidStatuses = {
          accepted: true,
          declined: true,
          revoked: true
        };

        if (Array.isArray(statusHistory)) {
          return !!!statusHistory.find(({ status }) => {
            return invalidStatuses[status];
          });
        }

        return false;
      }

      let statusHistory = notification.statusHistory;

      if (requestIsValid(statusHistory)) {
        statusHistory.push({
          status: response,
          date: Date.now()
        });

        let update = { statusHistory };
        let result = await netInterface(
          "user.respondToCollaborationRequest",
          notification,
          response
        );

        dispatch(
          mergeDataByPath(`notifications.${notification.customId}`, update)
        );

        if (response === "accepted" && result && result.block) {
          const { block } = result;
          block.path = `orgs.${block.customId}`;
          dispatch(
            makeMultiple([
              setDataByPath(block.path, block),
              mergeDataByPath(`user.user.orgs`, [block.customId])
            ])
          );
        }
      }
    },

    async fetchNotifications() {
      let result = await netInterface("user.getCollaborationRequests");
      let { requests: notifications } = result;
      notifications = notifications || [];
      let notificationsObj = {};
      notifications.forEach(notification => {
        notificationsObj[notification.customId] = notification;
      });

      dispatch(mergeDataByPath("notifications", notificationsObj));
    }
  };
}
