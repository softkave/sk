import { Dispatch } from "redux";
import { INotification } from "../../../models/notification/notification";
import * as userNet from "../../../net/user";
import * as notificationActions from "../../notifications/actions";
import { IAppState } from "../../store";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  IdispatchOperationFuncProps,
  IOperationFuncOptions,
  isOperationStarted,
} from "../operation";
import { updateNotificationOperationId } from "../operationIds";
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
    updateNotificationOperationId,
    notification.customId
  );

  if (operation && isOperationStarted(operation, options.scopeId)) {
    return;
  }

  const dispatchOptions: IdispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationId: updateNotificationOperationId,
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
