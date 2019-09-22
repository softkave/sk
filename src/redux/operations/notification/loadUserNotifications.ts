import { Dispatch } from "redux";

import { IUser } from "../../../models/user/user";
import * as userNet from "../../../net/user";
import * as notificationActions from "../../notifications/actions";
import { IReduxState } from "../../store";
import * as userActions from "../../users/actions";
import { transformError } from "../error";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  isOperationStarted
} from "../operation";
import { loadUserNotificationsOperationID } from "../operationIDs";
import { getOperationsWithID } from "../selectors";

export default async function loadUserNotificationsOperation(
  state: IReduxState,
  dispatch: Dispatch,
  user: IUser
) {
  const operations = getOperationsWithID(
    state,
    loadUserNotificationsOperationID
  );

  if (operations[0] && isOperationStarted(operations[0])) {
    return;
  }

  dispatchOperationStarted(dispatch, loadUserNotificationsOperationID);

  try {
    const requests = await userNet.getCollaborationRequests();
    const ids = requests.map(request => request.customId);

    dispatch(notificationActions.bulkAddNotificationsRedux(requests));
    dispatch(
      userActions.updateUserRedux(
        user.customId,
        {
          notifications: ids
        },
        { arrayUpdateStrategy: "replace" }
      )
    );

    dispatchOperationComplete(dispatch, loadUserNotificationsOperationID);
  } catch (error) {
    const transformedError = transformError(error);
    dispatchOperationError(
      dispatch,
      loadUserNotificationsOperationID,
      null,
      transformedError
    );
  }
}
