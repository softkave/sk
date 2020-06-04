import * as userNet from "../../../net/user";
import * as notificationActions from "../../notifications/actions";
import { getSignedInUserRequired } from "../../session/selectors";
import store from "../../store";
import * as userActions from "../../users/actions";
import { pushOperation } from "../actions";
import {
  IOperationFuncOptions,
  isOperationStarted,
  operationStatusTypes,
} from "../operation";
import { loadUserNotificationsOperationId } from "../operationIDs";
import { getFirstOperationWithId } from "../selectors";

export default async function loadUserNotificationsOperationFunc(
  dataProps: {} = {},
  options: IOperationFuncOptions = {}
) {
  const user = getSignedInUserRequired(store.getState());
  const operation = getFirstOperationWithId(
    store.getState(),
    loadUserNotificationsOperationId
  );

  if (operation && isOperationStarted(operation, options.scopeId)) {
    return;
  }

  store.dispatch(
    pushOperation(loadUserNotificationsOperationId, {
      scopeId: options.scopeId,
      status: operationStatusTypes.operationStarted,
      timestamp: Date.now(),
    })
  );

  try {
    const result = await userNet.getUserNotifications();

    if (result && result.errors) {
      throw result.errors;
    }

    const { notifications } = result;
    const ids = notifications.map((request) => request.customId);

    store.dispatch(
      notificationActions.bulkAddNotificationsRedux(notifications)
    );
    store.dispatch(
      userActions.updateUserRedux(
        user.customId,
        {
          notifications: ids,
        },
        { arrayUpdateStrategy: "replace" }
      )
    );

    store.dispatch(
      pushOperation(loadUserNotificationsOperationId, {
        scopeId: options.scopeId,
        status: operationStatusTypes.operationComplete,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    store.dispatch(
      pushOperation(loadUserNotificationsOperationId, {
        error,
        scopeId: options.scopeId,
        status: operationStatusTypes.operationError,
        timestamp: Date.now(),
      })
    );
  }
}
