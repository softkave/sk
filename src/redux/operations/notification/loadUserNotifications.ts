import { Dispatch } from "redux";
import { IUser } from "../../../models/user/user";
import * as userNet from "../../../net/user";
import OperationError from "../../../utils/operation-error/OperationError";
import * as notificationActions from "../../notifications/actions";
import { IReduxState } from "../../store";
import * as userActions from "../../users/actions";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  IDispatchOperationFuncProps,
  IOperationFuncOptions,
  isOperationStarted
} from "../operation";
import { loadUserNotificationsOperationID } from "../operationIDs";
import { getOperationsWithID } from "../selectors";

export interface ILoadUserNotificationsOperationFuncDataProps {
  user: IUser;
}

export default async function loadUserNotificationsOperationFunc(
  state: IReduxState,
  dispatch: Dispatch,
  dataProps: ILoadUserNotificationsOperationFuncDataProps,
  options: IOperationFuncOptions
) {
  const { user } = dataProps;
  const operations = getOperationsWithID(
    state,
    loadUserNotificationsOperationID
  );

  if (operations[0] && isOperationStarted(operations[0], options.scopeID)) {
    return;
  }

  const dispatchOptions: IDispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationID: loadUserNotificationsOperationID
  };

  dispatchOperationStarted(dispatchOptions);

  try {
    const result = await userNet.getCollaborationRequests();

    if (result && result.errors) {
      throw result.errors;
    }

    const { requests } = result;
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

    dispatchOperationComplete(dispatchOptions);
  } catch (error) {
    const transformedError = OperationError.fromAny(error);

    dispatchOperationError({ ...dispatchOptions, error: transformedError });
  }
}
