import { IUser } from "../../../models/user/user";
import * as userNet from "../../../net/user";
import OperationError from "../../../utils/operation-error/OperationError";
import * as notificationActions from "../../notifications/actions";
import { getSignedInUserRequired } from "../../session/selectors";
import store from "../../store";
import * as userActions from "../../users/actions";
import { pushOperation } from "../actions";
import {
  defaultOperationStatusTypes,
  IOperationFuncOptions,
  isOperationStarted
} from "../operation";
import { loadUserNotificationsOperationID } from "../operationIDs";
import { getFirstOperationWithID } from "../selectors";

export interface ILoadUserNotificationsOperationFuncDataProps {}

export default async function loadUserNotificationsOperationFunc(
  dataProps: ILoadUserNotificationsOperationFuncDataProps = {},
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
    pushOperation(
      loadUserNotificationsOperationID,
      {
        scopeID: options.scopeID,
        status: defaultOperationStatusTypes.operationStarted,
        timestamp: Date.now()
      },
      options.resourceID
    )
  );

  try {
    const result = await userNet.getCollaborationRequests();

    if (result && result.errors) {
      throw result.errors;
    }

    const { requests } = result;
    const ids = requests.map(request => request.customId);

    store.dispatch(notificationActions.bulkAddNotificationsRedux(requests));
    store.dispatch(
      userActions.updateUserRedux(
        user.customId,
        {
          notifications: ids
        },
        { arrayUpdateStrategy: "replace" }
      )
    );

    store.dispatch(
      pushOperation(
        loadUserNotificationsOperationID,
        {
          scopeID: options.scopeID,
          status: defaultOperationStatusTypes.operationComplete,
          timestamp: Date.now()
        },
        options.resourceID
      )
    );
  } catch (error) {
    const transformedError = OperationError.fromAny(error);

    store.dispatch(
      pushOperation(
        loadUserNotificationsOperationID,
        {
          error: transformedError,
          scopeID: options.scopeID,
          status: defaultOperationStatusTypes.operationComplete,
          timestamp: Date.now()
        },
        options.resourceID
      )
    );
  }
}
