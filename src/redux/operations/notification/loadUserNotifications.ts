import { createAsyncThunk } from "@reduxjs/toolkit";
import { INotification } from "../../../models/notification/notification";
import UserAPI from "../../../net/user/user";
import { getNewId } from "../../../utils/utils";
import NotificationActions from "../../notifications/actions";
import SessionSelectors from "../../session/selectors";
import { IAppAsyncThunkConfig, IStoreLikeObject } from "../../types";
import UserActions from "../../users/actions";
import {
    dispatchOperationCompleted,
    dispatchOperationError,
    dispatchOperationStarted,
    IOperation,
    isOperationStarted,
    wrapUpOpAction,
} from "../operation";
import OperationType from "../OperationType";
import OperationSelectors from "../selectors";
import { IOperationActionBaseArgs } from "../types";

export const loadUserNotificationsOpAction = createAsyncThunk<
    IOperation | undefined,
    IOperationActionBaseArgs,
    IAppAsyncThunkConfig
>("op/notification/loadUserNotifications", async (arg, thunkAPI) => {
    const opId = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        opId
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(opId, OperationType.LoadUserNotifications)
    );

    try {
        const result = await UserAPI.getUserNotifications();

        if (result && result.errors) {
            throw result.errors;
        }

        storeUserNotifications(thunkAPI, result.requests);
        thunkAPI.dispatch(
            dispatchOperationCompleted(
                opId,
                OperationType.LoadUserNotifications
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                opId,
                OperationType.LoadUserNotifications,
                error
            )
        );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
});

export const storeUserNotifications = (
    store: IStoreLikeObject,
    notifications: INotification[]
) => {
    const user = SessionSelectors.assertGetUser(store.getState());
    const ids = notifications.map((request) => request.customId);

    store.dispatch(NotificationActions.bulkAddNotifications(notifications));
    store.dispatch(
        UserActions.updateUser({
            id: user.customId,
            data: {
                notifications: ids,
            },
            meta: { arrayUpdateStrategy: "replace" },
        })
    );
};
