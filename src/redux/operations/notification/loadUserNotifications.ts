import { createAsyncThunk } from "@reduxjs/toolkit";
import { INotification } from "../../../models/notification/notification";
import UserAPI from "../../../net/user/user";
import { getNewId } from "../../../utils/utils";
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

export const loadUserNotificationsOpAction = createAsyncThunk<
    IOperation | undefined,
    IOperationActionBaseArgs,
    IAppAsyncThunkConfig
>("op/notification/loadUserNotifications", async (arg, thunkAPI) => {
    const id = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        id
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(id, OperationType.LoadUserNotifications)
    );

    try {
        const result = await UserAPI.getUserNotifications();

        if (result && result.errors) {
            throw result.errors;
        }

        // dispatch-type-error
        thunkAPI.dispatch(
            completeLoadUserNotifications({
                notifications: result.notifications,
            }) as any
        );

        thunkAPI.dispatch(
            dispatchOperationCompleted(id, OperationType.LoadUserNotifications)
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                id,
                OperationType.LoadUserNotifications,
                error
            )
        );
    }

    return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});

export const completeLoadUserNotifications = createAsyncThunk<
    void,
    { notifications: INotification[] },
    IAppAsyncThunkConfig
>("op/notification/completeLoadUserNotifications", async (arg, thunkAPI) => {
    const { notifications } = arg;
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());
    const ids = notifications.map((request) => request.customId);

    thunkAPI.dispatch(NotificationActions.bulkAddNotifications(notifications));

    thunkAPI.dispatch(
        UserActions.updateUser({
            id: user.customId,
            data: {
                notifications: ids,
            },
            meta: { arrayUpdateStrategy: "replace" },
        })
    );
});
