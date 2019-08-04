import React from "react";
import { connect } from "react-redux";

import {
  filterErrorByBaseName,
  stripFieldsFromError
} from "../../components/FOR.ts";
import { IPipeline } from "../../components/FormPipeline.js";
import { makePipeline } from "../../components/FormPipeline.ts";
import NotificationList from "../../components/notification/NotificationList.jsx";
import netInterface from "../../net/index.js";
import { mergeDataByPath, setDataByPath } from "../../redux/actions/data.ts";
import { makeMultiple } from "../../redux/actions/make.js";

class NotificationsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }

  public async componentDidMount() {
    if (!this.props.notifications) {
      try {
        await this.props.fetchNotifications();
      } catch (error) {
        this.setState({ error });
      }
    }
  }

  public render() {
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

// TODO: Define notification's type
interface IOnClickNotificationParams {
  notification: any;
}

interface IOnClickNotificationProcessParams extends IOnClickNotificationParams {
  data: { readAt: number };
}

const clickNotificationMethods: IPipeline<
  IOnClickNotificationParams,
  IOnClickNotificationProcessParams,
  null,
  null
> = {
  process({ params }) {
    return { ...params, data: { readAt: Date.now() } };
  },

  async net({ params }) {
    const { notification, data } = params;
    return await netInterface("user.updateCollaborationRequest", {
      request: notification,
      data
    });
  },

  redux({ state, dispatch, params }) {
    const { notification, data } = params;
    dispatch(mergeDataByPath(`notifications.${notification.customId}`, data));
  }
};

const respondToNotificationMethods = {
  process({ notification }) {
    const statusHistory = notification.statusHistory;

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
    const statusHistory = notification.statusHistory;

    statusHistory.push({
      status: response,
      date: Date.now()
    });

    const update = { statusHistory };

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
    const notificationsObj = {};
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
