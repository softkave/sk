import { Dispatch } from "redux";

import { INotification } from "../../../models/notification/notification";
import { IUser } from "../../../models/user/user";
import * as userNet from "../../../net/user";
import * as notificationActions from "../../notifications/actions";
import { IReduxState } from "../../store";
import { transformError } from "../error";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  isOperationStarted
} from "../operation";
import { updateNotificationOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";

export default async function markNotificationReadOperation(
  state: IReduxState,
  dispatch: Dispatch,
  user: IUser,
  notification: INotification
) {
  const operation = getOperationWithIDForResource(
    state,
    updateNotificationOperationID,
    notification.customId
  );

  if (operation && isOperationStarted(operation)) {
    return;
  }

  dispatchOperationStarted(dispatch, updateNotificationOperationID);

  try {
    const data = { readAt: Date.now() };
    await userNet.updateCollaborationRequest({ request: notification, data });
    dispatch(
      notificationActions.updateNotificationRedux(notification.customId, data, {
        arrayUpdateStrategy: "replace"
      })
    );

    dispatchOperationComplete(dispatch, updateNotificationOperationID);
  } catch (error) {
    const transformedError = transformError(error);
    dispatchOperationError(
      dispatch,
      updateNotificationOperationID,
      null,
      transformedError
    );
  }
}
