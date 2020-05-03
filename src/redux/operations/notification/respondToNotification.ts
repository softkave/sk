import { canRespondToNotification } from "../../../components/notification/utils";
import { IBlock } from "../../../models/block/block";
import {
  INotification,
  NotificationStatusText,
} from "../../../models/notification/notification";
import * as userNet from "../../../net/user";
import * as blockActions from "../../blocks/actions";
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
import { respondToNotificationOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";

export interface IRespondToNotificationOperationFuncDataProps {
  request: INotification;
  response: NotificationStatusText;
}

export default async function respondToNotificationOperationFunc(
  dataProps: IRespondToNotificationOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const user = getSignedInUserRequired(store.getState());
  const { request, response } = dataProps;
  const operation = getOperationWithIDForResource(
    store.getState(),
    respondToNotificationOperationID,
    request.customId
  );

  if (operation && isOperationStarted(operation, options.scopeID)) {
    return;
  }

  store.dispatch(
    pushOperation(
      respondToNotificationOperationID,
      {
        scopeID: options.scopeID,
        status: operationStatusTypes.operationStarted,
        timestamp: Date.now(),
      },
      request.customId
    )
  );

  try {
    if (canRespondToNotification(request)) {
      throw new Error("Request not valid");
    }

    const result = await userNet.respondToCollaborationRequest(
      request,
      response
    );

    if (result && result.errors) {
      throw result.errors;
    }

    const statusHistory = request.statusHistory.concat({
      status: response,
      date: Date.now(),
    });

    const update = { statusHistory };

    store.dispatch(
      notificationActions.updateNotificationRedux(request.customId, update, {
        arrayUpdateStrategy: "replace",
      })
    );

    if (response === "accepted" && result) {
      const { block } = result as { block: IBlock };

      store.dispatch(blockActions.addBlockRedux(block));
      store.dispatch(
        userActions.updateUserRedux(
          user.customId,
          { orgs: [request.from.blockId] },
          { arrayUpdateStrategy: "concat" }
        )
      );
    }

    store.dispatch(
      pushOperation(
        respondToNotificationOperationID,
        {
          scopeID: options.scopeID,
          status: operationStatusTypes.operationComplete,
          timestamp: Date.now(),
        },
        request.customId
      )
    );
  } catch (error) {
    store.dispatch(
      pushOperation(
        respondToNotificationOperationID,
        {
          error,
          scopeID: options.scopeID,
          status: operationStatusTypes.operationError,
          timestamp: Date.now(),
        },
        request.customId
      )
    );
  }
}
