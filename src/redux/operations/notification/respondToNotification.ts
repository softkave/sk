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
import OperationErrorItem from "../../../utils/operation-error/OperationErrorItem";
import * as blockActions from "../../blocks/actions";
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
import { respondToNotificationOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";

export interface IRespondToNotificationOperationFuncDataProps {
  user: IUser;
  request: INotification;
  response: NotificationStatusText;
}

export default async function respondToNotificationOperationFunc(
  state: IReduxState,
  dispatch: Dispatch,
  dataProps: IRespondToNotificationOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { user, request, response } = dataProps;
  const operation = getOperationWithIDForResource(
    state,
    respondToNotificationOperationID,
    request.customId
  );

  if (operation && isOperationStarted(operation, options.scopeID)) {
    return;
  }

  const dispatchOptions: IDispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationID: respondToNotificationOperationID,
    resourceID: request.customId
  };

  dispatchOperationStarted(dispatchOptions);

  try {
    if (canRespondToNotification(request)) {
      throw new OperationErrorItem("error", "Request is not valid");
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

    dispatchOperationComplete(dispatchOptions);
  } catch (error) {
    const transformedError = OperationError.fromAny(error);

    dispatchOperationError({ ...dispatchOptions, error: transformedError });
  }
}
