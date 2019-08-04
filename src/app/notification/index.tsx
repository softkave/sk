import React from "react";
import { connect } from "react-redux";

import { makePipeline, PipelineEntryFunc } from "../../components/FormPipeline";
import { IPipeline } from "../../components/FormPipeline.js";
import NotificationList from "../../components/notification/NotificationList";
import { IBlock } from "../../models/block/block";
import netInterface from "../../net/index";
import { INetResult } from "../../net/query";
import { mergeDataByPath, setDataByPath } from "../../redux/actions/data";
import { makeMultiple } from "../../redux/actions/make";

// TODO: Define notification's types
export interface INotificationsContainerProps extends INotificationMethods {
  notifications?: any[];
}

interface INotificationsContainerState {
  error?: Error;
}

class NotificationsContainer extends React.Component<
  INotificationsContainerProps,
  INotificationsContainerState
> {
  constructor(props) {
    super(props);
    this.state = {
      error: undefined
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

  redux({ dispatch, params }) {
    const { notification, data } = params;
    dispatch(mergeDataByPath(`notifications.${notification.customId}`, data));
  }
};

// TODO: Define notification's type
interface IRespondToNotificationParams {
  notification: any;
  response: string;
}

interface IRespondToNotificationNetResult extends INetResult {
  block?: IBlock;
}

const respondToNotificationMethods: IPipeline<
  IRespondToNotificationParams,
  IRespondToNotificationParams,
  IRespondToNotificationNetResult,
  IRespondToNotificationNetResult
> = {
  process({ params }) {
    const { notification } = params;
    const statusHistory = notification.statusHistory;

    if (requestIsValid(statusHistory)) {
      return params;
    }

    throw [{ field: "error", message: new Error("Request is not valid") }];
  },

  async net({ params }) {
    const { notification, response } = params;
    return await netInterface(
      "user.respondToCollaborationRequest",
      notification,
      response
    );
  },

  redux({ dispatch, params, result }) {
    const { notification, response } = params;
    const { block } = result;
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

// TODO: Define notification's type
interface IFetchNotificationsNetResult {
  requests: any[];
}

const fetchNotificationsMethods: IPipeline<
  null,
  null,
  IFetchNotificationsNetResult
> = {
  async net() {
    return await netInterface("user.getCollaborationRequests");
  },

  redux({ state, dispatch, result }) {
    const { requests } = result;
    let notifications = requests;
    notifications = notifications || [];
    const notificationsObj = {};
    notifications.forEach(notification => {
      notificationsObj[notification.customId] = notification;
    });

    dispatch(mergeDataByPath("notifications", notificationsObj));
  }
};

export type OnClickNotification = PipelineEntryFunc<IOnClickNotificationParams>;
export type OnRespondToNotification = PipelineEntryFunc<
  IRespondToNotificationParams
>;
export type FetchNotifications = PipelineEntryFunc<null>;

export interface INotificationMethods {
  onClickNotification: OnClickNotification;
  onRespond: OnRespondToNotification;
  fetchNotifications: FetchNotifications;
}

function getNotificationMethods(reduxParams): INotificationMethods {
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
