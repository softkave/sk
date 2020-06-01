import { Dispatch } from "redux";
import { INotification } from "../../../models/notification/notification";
import * as userNet from "../../../net/user";
import * as notificationActions from "../../notifications/actions";
import { IAppState } from "../../store";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  IDispatchOperationFuncProps,
  IOperationFuncOptions,
  isOperationStarted,
} from "../operation";
import { updateNotificationOperationID } from "../operationIDs";
import { getOperationWithIdForResource } from "../selectors";

export interface IMarkNotificationReadOperationFuncDataProps {
  notification: INotification;
}

export default async function markNotificationReadOperationFunc(
  state: IAppState,
  dispatch: Dispatch,
  dataProps: IMarkNotificationReadOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { notification } = dataProps;
  const operation = getOperationWithIdForResource(
    state,
    updateNotificationOperationID,
    notification.customId
  );

  if (operation && isOperationStarted(operation, options.scopeId)) {
    return;
  }

  const dispatchOptions: IDispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationId: updateNotificationOperationID,
    resourceId: notification.customId,
  };

  dispatchOperationStarted(dispatchOptions);

  try {
    const data = { readAt: Date.now() };
    const result = await userNet.updateCollaborationRequest(notification, data);

    if (result && result.errors) {
      throw result.errors;
    }

    // TODO: Should control wait for net call, or should it happen before net call?
    dispatch(
      notificationActions.updateNotificationRedux(notification.customId, data, {
        arrayUpdateStrategy: "replace",
      })
    );

    dispatchOperationComplete(dispatchOptions);
  } catch (error) {
    dispatchOperationError({ ...dispatchOptions, error });
  }
}
