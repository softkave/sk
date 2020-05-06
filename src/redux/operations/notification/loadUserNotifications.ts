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
import { loadUserNotificationsOperationID } from "../operationIDs";
import { getFirstOperationWithID } from "../selectors";

export default async function loadUserNotificationsOperationFunc(
  dataProps: {} = {},
  options: IOperationFuncOptions = {}
) {
  const user = getSignedInUserRequired(store.getState());
  const operation = getFirstOperationWithID(
    store.getState(),
    loadUserNotificationsOperationID
  );

  if (operation && isOperationStarted(operation, options.scopeID)) {
    return;
  }

  store.dispatch(
    pushOperation(loadUserNotificationsOperationID, {
      scopeID: options.scopeID,
      status: operationStatusTypes.operationStarted,
      timestamp: Date.now(),
    })
  );

  try {
    const result = await userNet.getCollaborationRequests();

    if (result && result.errors) {
      throw result.errors;
    }

    const { requests } = result;
    const ids = requests.map((request) => request.customId);

    store.dispatch(notificationActions.bulkAddNotificationsRedux(requests));
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
      pushOperation(loadUserNotificationsOperationID, {
        scopeID: options.scopeID,
        status: operationStatusTypes.operationComplete,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    store.dispatch(
      pushOperation(loadUserNotificationsOperationID, {
        error,
        scopeID: options.scopeID,
        status: operationStatusTypes.operationError,
        timestamp: Date.now(),
      })
    );
  }
}
