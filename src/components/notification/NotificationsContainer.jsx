import React from "react";
import { connect } from "react-redux";
import netInterface from "../../net";
import { mergeDataByPath } from "../../redux/actions/data";
import NotificationList from "./NotificationList.jsx";

class NotificationsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //loading: !props.notifications,
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
    // console.log(this.props, this.state);

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
    currentNotification: state.currentNotification,
    onClickNotification(notification) {
      if (!notification.readAt) {
        dispatch(
          mergeDataByPath(`notifications.${notification.id}.readAt`, Date.now())
        );
        netInterface("user.updateReadNotification", { request: notification });
      }
    },

    onRespond(notification, response) {
      dispatch(`notifications.${notification.id}`, {
        response,
        respondedAt: Date.now()
      });

      netInterface("user.respondToCollaborationRequest", {
        response,
        request: notification
      });
    },

    async fetchNotifications() {
      let notifications =
        (await netInterface("user.getCollaborationRequests")) || [];
      let notificationsObj = {};
      notifications.forEach(notification => {
        //notification.path = `notifications.${notification.id}`;
        notificationsObj[notification.id] = notification;
      });

      // console.log(notifications, notificationsObj);
      dispatch(mergeDataByPath("notifications", notificationsObj));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(NotificationsContainer);
