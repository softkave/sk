import { Dispatch } from "redux";
import { canRespondToNotification } from "../../../components/notification/utils";
import { IBlock } from "../../../models/block/block";
import {
  INotification,
  NotificationStatusText
} from "../../../models/notification/notification";
import { IUser } from "../../../models/user/user";
import * as userNet from "../../../net/user";
import OperationError from "../../../utils/operation-error/OperationError";
import * as blockActions from "../../blocks/actions";
import * as notificationActions from "../../notifications/actions";
import { IReduxState } from "../../store";
import * as userActions from "../../users/actions";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  isOperationStarted
} from "../operation";
import { respondToNotificationOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";

export default async function respondToNotificationOperation(
  state: IReduxState,
  dispatch: Dispatch,
  user: IUser,
  request: INotification,
  response: NotificationStatusText
) {
  const operation = getOperationWithIDForResource(
    state,
    respondToNotificationOperationID,
    request.customId
  );

  if (operation && isOperationStarted(operation)) {
    return;
  }

  dispatchOperationStarted(
    dispatch,
    respondToNotificationOperationID,
    request.customId
  );

  try {
    if (canRespondToNotification(request)) {
      throw [{ field: "error", message: new Error("Request is not valid") }];
    }

    const result = await userNet.respondToCollaborationRequest({
      request,
      response
    });

    if (result && result.errors) {
      throw result.errors;
    }

    const statusHistory = request.statusHistory.concat({
      status: response,
      date: Date.now()
    });

    const update = { statusHistory };

    dispatch(
      notificationActions.updateNotificationRedux(request.customId, update, {
        arrayUpdateStrategy: "replace"
      })
    );

    if (response === "accepted") {
      const { block } = result as { block: IBlock };

      if (block) {
        dispatch(blockActions.addBlockRedux(block));
        dispatch(
          userActions.updateUserRedux(
            user.customId,
            { orgs: [block.customId] },
            { arrayUpdateStrategy: "concat" }
          )
        );
      }
    }

    dispatchOperationComplete(
      dispatch,
      respondToNotificationOperationID,
      request.customId
    );
  } catch (error) {
    const transformedError = OperationError.fromAny(error);
    dispatchOperationError(
      dispatch,
      respondToNotificationOperationID,
      request.customId,
      transformedError
    );
  }
}
