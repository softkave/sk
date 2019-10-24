import { Dispatch } from "redux";
import { INotification } from "../../../models/notification/notification";
import { IUser } from "../../../models/user/user";
import * as userNet from "../../../net/user";
import OperationError from "../../../utils/operation-error/OperationError";
import * as notificationActions from "../../notifications/actions";
import { IReduxState } from "../../store";
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

  dispatchOperationStarted(
    dispatch,
    updateNotificationOperationID,
    notification.customId
  );

  try {
    const data = { readAt: Date.now() };
    const result = await userNet.updateCollaborationRequest({
      request: notification,
      data
    });

    if (result && result.errors) {
      throw result.errors;
    }

    // TODO: Should control wait for net call, or should it happen before net call?
    dispatch(
      notificationActions.updateNotificationRedux(notification.customId, data, {
        arrayUpdateStrategy: "replace"
      })
    );

    dispatchOperationComplete(
      dispatch,
      updateNotificationOperationID,
      notification.customId
    );
  } catch (error) {
    const transformedError = OperationError.fromAny(error);
    dispatchOperationError(
      dispatch,
      updateNotificationOperationID,
      notification.customId,
      transformedError
    );
  }
}
