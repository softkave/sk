import React from "react";
import { connect } from "react-redux";

import NotificationList from "../../components/notification/NotificationList.jsx";
import {
  filterErrorByBaseName,
  stripFieldsFromError
} from "../../components/FOR.js";
import netInterface from "../../net/index.js";
import { mergeDataByPath, setDataByPath } from "../../redux/actions/data.js";
import { makeMultiple } from "../../redux/actions/make.js";
import { makePipeline } from "../../components/FormPipeline.js";

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

function throwOnError(result, filterBaseNames, stripBaseNames) {
  if (result && result.errors) {
    if (filterBaseNames) {
      result.errors = filterErrorByBaseName(
        result.errors,
        filterErrorByBaseName
      );
    }

    if (stripBaseNames) {
      result.errors = stripFieldsFromError(result.errors, stripBaseNames);
    }

    throw result.errors;
  }

  return result;
}

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

const clickNotificationMethods = {
  process() {
    return { readAt: Date.now() };
  },

  async net({ notification, data }) {
    await netInterface("user.updateCollaborationRequest", {
      request: notification,
      data
    });
  },

  handleError(result) {
    throwOnError(result);
  },

  redux({ state, dispatch, notification, data }) {
    dispatch(mergeDataByPath(`notifications.${notification.customId}`, data));
  }
};

const respondToNotificationMethods = {
  process({ notification }) {
    let statusHistory = notification.statusHistory;

    if (requestIsValid(statusHistory)) {
      return;
    }

    throw new Error("Request is not valid");
  },

  async net({ notification, response }) {
    return await netInterface(
      "user.respondToCollaborationRequest",
      notification,
      response
    );
  },

  handleError(result) {
    throwOnError(result);
  },

  redux({ state, dispatch, notification, response, block }) {
    let statusHistory = notification.statusHistory;

    statusHistory.push({
      status: response,
      date: Date.now()
    });

    let update = { statusHistory };

    dispatch(mergeDataByPath(`notifications.${notification.customId}`, update));

    if (response === "accepted" && block) {
      block.path = `orgs.${block.customId}`;
      dispatch(
        makeMultiple([
          setDataByPath(block.path, block),
          mergeDataByPath(`user.user.orgs`, [block.customId])
        ])
      );
    }
  }
};

const fetchNotificationsMethods = {
  process() {},

  async net() {
    return await netInterface("user.getCollaborationRequests");
  },

  handleError(result) {
    throwOnError(result);
  },

  redux({ state, dispatch, requests: notifications }) {
    notifications = notifications || [];
    let notificationsObj = {};
    notifications.forEach(notification => {
      notificationsObj[notification.customId] = notification;
    });

    dispatch(mergeDataByPath("notifications", notificationsObj));
  }
};

function getNotificationMethods(reduxParams) {
  return {
    onClickNotification: makePipeline(clickNotificationMethods, reduxParams),
    onRespond: makePipeline(respondToNotificationMethods, reduxParams),
    fetchNotifications: makePipeline(fetchNotificationsMethods, reduxParams)
  };
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
    ...getNotificationMethods({ state, dispatch, user: state.user.user })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(NotificationsContainer);
