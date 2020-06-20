import { Dispatch } from "redux";
import { INotification } from "../../../models/notification/notification";
import * as userNet from "../../../net/user";
import { getDateString } from "../../../utils/utils";
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
import { OperationIds.updateNotification } from "../operationIDs";
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
    OperationIds.updateNotification,
    notification.customId
  );

  if (operation && isOperationStarted(operation, options.scopeId)) {
    return;
  }

  const dispatchOptions: IDispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationId: OperationIds.updateNotification,
    resourceId: notification.customId,
  };

  dispatchOperationStarted(dispatchOptions);

  try {
    const readAt = getDateString();
    const result = await userNet.markNotificationRead(notification, readAt);

    if (result && result.errors) {
      throw result.errors;
    }

    // TODO: Should control wait for net call, or should it happen before net call?
    dispatch(
      notificationActions.updateNotificationRedux(
        notification.customId,
        { readAt },
        {
          arrayUpdateStrategy: "replace",
        }
      )
    );

    dispatchOperationComplete(dispatchOptions);
  } catch (error) {
    dispatchOperationError({ ...dispatchOptions, error });
  }
}
