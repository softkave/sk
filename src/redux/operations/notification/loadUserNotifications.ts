import { createAsyncThunk } from "@reduxjs/toolkit";
import UserAPI from "../../../net/user";
import { newId } from "../../../utils/utils";
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
import { IOperationActionBaseArgs } from "../types";

export const loadUserNotificationsOperationAction = createAsyncThunk<
  IOperation | undefined,
  IOperationActionBaseArgs,
  IAppAsyncThunkConfig
>("notification/loadUserNotifications", async (arg, thunkAPI) => {
  const id = arg.opId || newId();

  const operation = OperationSelectors.getOperationWithId(
    thunkAPI.getState(),
    id
  );

  if (isOperationStarted(operation)) {
    return;
  }

  await thunkAPI.dispatch(
    dispatchOperationStarted(id, OperationType.LoadUserNotifications)
  );

  try {
    const user = SessionSelectors.getSignedInUserRequired(thunkAPI.getState());
    const result = await UserAPI.getUserNotifications();

    if (result && result.errors) {
      throw result.errors;
    }

    const { notifications } = result;
    const ids = notifications.map((request) => request.customId);

    await thunkAPI.dispatch(
      NotificationActions.bulkAddNotifications(notifications)
    );

    await thunkAPI.dispatch(
      UserActions.updateUser({
        id: user.customId,
        data: {
          notifications: ids,
        },
        meta: { arrayUpdateStrategy: "replace" },
      })
    );

    await thunkAPI.dispatch(
      dispatchOperationCompleted(id, OperationType.LoadUserNotifications)
    );
  } catch (error) {
    await thunkAPI.dispatch(
      dispatchOperationError(id, OperationType.LoadUserNotifications, error)
    );
  }

  return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
