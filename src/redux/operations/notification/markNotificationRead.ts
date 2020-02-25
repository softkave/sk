import { Dispatch } from "redux";
import { INotification } from "../../../models/notification/notification";
import * as userNet from "../../../net/user";
import OperationError from "../../../utils/operation-error/OperationError";
import * as notificationActions from "../../notifications/actions";
import { IReduxState } from "../../store";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  IDispatchOperationFuncProps,
  IOperationFuncOptions,
  isOperationStarted
} from "../operation";
import { updateNotificationOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";

export interface IMarkNotificationReadOperationFuncDataProps {
  notification: INotification;
}

export default async function markNotificationReadOperationFunc(
  state: IReduxState,
  dispatch: Dispatch,
  dataProps: IMarkNotificationReadOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { notification } = dataProps;
  const operation = getOperationWithIDForResource(
    state,
    updateNotificationOperationID,
    notification.customId
  );

  if (operation && isOperationStarted(operation, options.scopeID)) {
    return;
  }

  const dispatchOptions: IDispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationID: updateNotificationOperationID,
    resourceID: notification.customId
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
        arrayUpdateStrategy: "replace"
      })
    );

    dispatchOperationComplete(dispatchOptions);
  } catch (error) {
    const transformedError = OperationError.fromAny(error);

    dispatchOperationError({ ...dispatchOptions, error: transformedError });
  }
}
