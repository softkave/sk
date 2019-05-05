import React from "react";
import { connect } from "react-redux";
import netInterface from "../../net";
import { setDataByPath, mergeDataByPath } from "../../redux/actions/data";
import { makeMultiple } from "../../redux/actions/make";
import NotificationList from "./NotificationList.jsx";

class NotificationsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }

  async componentDidMount() {
    if (!this.props.notifications) {
      try {
        await this.props.fetchNotifications();
      } catch (error) {
        this.setState({ error });
      }
    }
  }

  render() {
    const { notifications, onRespond, onClickNotification } = this.props;
    const { error } = this.state;

    if (!notifications) {
      return "Loading";
    } else if (error) {
      return error.message || "An error occurred";
    }

    return (
      <NotificationList
        notifications={notifications}
        onRespond={onRespond}
        onClickNotification={onClickNotification}
      />
    );
  }
}

function mapStateToProps(state) {
  return { state };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

function mergeProps({ state }, { dispatch }, ownProps) {
  return {
    notifications: state.notifications,
    async onClickNotification(notification) {
      if (!notification.readAt) {
        let update = { readAt: Date.now() };
        dispatch(
          mergeDataByPath(`notifications.${notification.customId}`, update)
        );
        netInterface("user.updateCollaborationRequest", notification, update);
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
        dispatch(
          mergeDataByPath(`notifications.${notification.customId}`, update)
        );

        let result = await netInterface(
          "user.respondToCollaborationRequest",
          notification,
          response
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(NotificationsContainer);
