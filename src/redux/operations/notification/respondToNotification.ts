import { Dispatch } from "redux";

import { IBlock } from "../../../models/block/block";
import { INotification } from "../../../models/notification/notification";
import { IUser } from "../../../models/user/user";
import * as userNet from "../../../net/user";
import * as blockActions from "../../blocks/actions";
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
import { respondToNotificationOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";

export default async function respondToNotificationOperation(
  state: IReduxState,
  dispatch: Dispatch,
  user: IUser,
  request: INotification,
  response: string
) {
  function requestIsValid(statusHistory) {
    const invalidStatuses = {
      accepted: true,
      declined: true,
      revoked: true
    };

    if (Array.isArray(statusHistory)) {
      return !!!statusHistory.find(({ status }) => {
        return invalidStatuses[status];
      });
    }

    return false;
  }

  const operation = getOperationWithIDForResource(
    state,
    respondToNotificationOperationID,
    request.customId
  );

  if (operation && isOperationStarted(operation)) {
    return;
  }

  dispatchOperationStarted(dispatch, respondToNotificationOperationID);

  try {
    const statusHistory = request.statusHistory;

    if (!requestIsValid(statusHistory)) {
      throw [{ field: "error", message: new Error("Request is not valid") }];
    }

    const result = await userNet.respondToCollaborationRequest({
      request,
      response
    });

    request.statusHistory.concat({
      status: response,
      date: Date.now()
    });

    const update = { statusHistory };

    dispatch(
      notificationActions.updateNotificationRedux(request.customId, update, {
        arrayUpdateStrategy: "replace"
      })
    );

    if (response === "accepted" && result) {
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

    dispatchOperationComplete(dispatch, respondToNotificationOperationID);
  } catch (error) {
    const transformedError = transformError(error);
    dispatchOperationError(
      dispatch,
      respondToNotificationOperationID,
      null,
      transformedError
    );
  }
}
