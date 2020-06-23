import { createAsyncThunk } from "@reduxjs/toolkit";
import { canRespondToNotification } from "../../../components/notification/utils";
import { IBlock } from "../../../models/block/block";
import {
  CollaborationRequestStatusType,
  INotification,
} from "../../../models/notification/notification";
import UserAPI from "../../../net/user";
import { getDateString, newId } from "../../../utils/utils";
import BlockActions from "../../blocks/actions";
import NotificationActions from "../../notifications/actions";
import SessionSelectors from "../../session/selectors";
import { IAppAsyncThunkConfig } from "../../types";
import UserActions from "../../users/actions";
import {
  dispatchOperationCompleted,
  dispatchOperationError,
  dispatchOperationStarted,
  IOperation,
  isOperationStarted,
} from "../operation";
import OperationType from "../OperationType";
import OperationSelectors from "../selectors";
import { GetOperationActionArgs } from "../types";

export interface IRespondToNotificationOperationActionArgs {
  request: INotification;
  response: CollaborationRequestStatusType;
}

export const respondToNotificationOperationAction = createAsyncThunk<
  IOperation | undefined,
  GetOperationActionArgs<IRespondToNotificationOperationActionArgs>,
  IAppAsyncThunkConfig
>("notification/respondToNotification", async (arg, thunkAPI) => {
  const id = arg.opId || newId();

  const operation = OperationSelectors.getOperationWithId(
    thunkAPI.getState(),
    id
  );

  if (isOperationStarted(operation)) {
    return;
  }

  await thunkAPI.dispatch(
    dispatchOperationStarted(
      id,
      OperationType.RespondToNotification,
      arg.request.customId
    )
  );

  try {
    const user = SessionSelectors.getSignedInUserRequired(thunkAPI.getState());

    if (canRespondToNotification(arg.request)) {
      throw new Error("Request not valid");
    }

    const result = await UserAPI.respondToCollaborationRequest(
      arg.request,
      arg.response
    );

    if (result && result.errors) {
      throw result.errors;
    }

    const statusHistory =
      arg.request.statusHistory?.concat({
        status: arg.response,
        date: getDateString(),
      }) || [];

    const update = { statusHistory };

    await thunkAPI.dispatch(
      NotificationActions.updateNotification({
        id: arg.request.customId,
        data: update,
        meta: {
          arrayUpdateStrategy: "replace",
        },
      })
    );

    if (arg.response === CollaborationRequestStatusType.Accepted && result) {
      const { block } = result as { block: IBlock };

      await thunkAPI.dispatch(BlockActions.addBlock(block));
      await thunkAPI.dispatch(
        UserActions.updateUser({
          id: user.customId,
          data: { orgs: [{ customId: arg.request.from!.blockId }] },
          meta: { arrayUpdateStrategy: "concat" },
        })
      );
    }

    await thunkAPI.dispatch(
      dispatchOperationCompleted(
        id,
        OperationType.RespondToNotification,
        arg.request.customId
      )
    );
  } catch (error) {
    await thunkAPI.dispatch(
      dispatchOperationError(
        id,
        OperationType.RespondToNotification,
        error,
        arg.request.customId
      )
    );
  }

  return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
