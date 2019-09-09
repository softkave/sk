import React from "react";
import { connect } from "react-redux";

import { Dispatch } from "redux";
import { makePipeline, PipelineEntryFunc } from "../../components/FormPipeline";
import { IPipeline } from "../../components/FormPipeline.js";
import NotificationList from "../../components/notification/NotificationList";
import { IBlock } from "../../models/block/block";
import { INotification } from "../../models/notification/notification";
import { IUser } from "../../models/user/user";
import netInterface from "../../net/index";
import { INetResult } from "../../net/query";
import { addBlockRedux } from "../../redux/blocks/actions";
import {
  bulkAddNotificationsRedux,
  updateNotificationRedux
} from "../../redux/notifications/actions";
import { getNotificationsAsArray } from "../../redux/notifications/selectors";
import { getSignedInUser } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import { updateUserRedux } from "../../redux/users/actions";

// TODO: Define notification's types
export interface INotificationsContainerProps extends INotificationMethods {
  notifications?: INotification[];
  user: IUser;
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
    if (!this.props.notifications && !this.props.user.loadingNotifications) {
      try {
        await this.props.fetchNotifications();
      } catch (error) {
        this.setState({ error });
      }
    }
  }

  public render() {
    const { notifications, onRespond, onClickNotification, user } = this.props;
    const { error } = this.state;

    if (!notifications) {
      return "Loading";
    } else if (error) {
      return error.message ? error.message : "An error occurred";
    }

    return (
      <NotificationList
        notifications={notifications}
        onRespond={onRespond}
        onClickNotification={onClickNotification}
        user={user}
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
  notification: INotification;
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
    dispatch(
      updateNotificationRedux(notification.customId, data, {
        arrayUpdateStrategy: "replace"
      })
    );
  }
};

// TODO: Define notification's type
interface IRespondToNotificationParams {
  notification: INotification;
  response: string;
  user: IUser;
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
    return await netInterface("user.respondToCollaborationRequest", {
      response,
      request: notification
    });
  },

  redux({ dispatch, params, result }) {
    const { notification, response, user } = params;
    const statusHistory = notification.statusHistory.concat({
      status: response,
      date: Date.now()
    });

    const update = { statusHistory };

    dispatch(
      updateNotificationRedux(notification.customId, update, {
        arrayUpdateStrategy: "replace"
      })
    );

    if (response === "accepted") {
      const { block } = result;

      if (block) {
        dispatch(addBlockRedux(block));
        dispatch(
          updateUserRedux(
            user.customId,
            { orgs: [block.customId] },
            { arrayUpdateStrategy: "concat" }
          )
        );
      }
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
  async net({ state, dispatch }) {
    const user = getSignedInUser(state);
    dispatch(
      updateUserRedux(
        user!.customId,
        { loadingNotifications: true },
        { arrayUpdateStrategy: "merge" }
      )
    );
    return await netInterface("user.getCollaborationRequests");
  },

  redux({ dispatch, result, state }) {
    const { requests } = result;
    const ids = requests.map(request => request.customId);
    const user = getSignedInUser(state);

    dispatch(bulkAddNotificationsRedux(requests));
    dispatch(
      updateUserRedux(
        user!.customId,
        {
          notifications: ids,
          loadingNotifications: false
        },
        { arrayUpdateStrategy: "replace" }
      )
    );
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
  return state;
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

function mergeProps(
  state: IReduxState,
  { dispatch }: { dispatch: Dispatch }
): INotificationsContainerProps {
  const user = getSignedInUser(state);
  const notifications = Array.isArray(user!.notifications)
    ? getNotificationsAsArray(state, user!.notifications)
    : undefined;

  const handlers = getNotificationMethods({ state, dispatch, user });

  return {
    user: user!,
    notifications,
    ...handlers
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(NotificationsContainer);
