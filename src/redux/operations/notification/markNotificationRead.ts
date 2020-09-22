import { createAsyncThunk } from "@reduxjs/toolkit";
import { INotification } from "../../../models/notification/notification";
import UserAPI from "../../../net/user";
import { getDateString, newId } from "../../../utils/utils";
import NotificationActions from "../../notifications/actions";
import SessionSelectors from "../../session/selectors";
import { IAppAsyncThunkConfig } from "../../types";
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

export interface IMarkNotificationReadOperationActionArgs {
    notification: INotification;
}

export const markNotificationReadOperationAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<IMarkNotificationReadOperationActionArgs>,
    IAppAsyncThunkConfig
>("notification/markNotificationRead", async (arg, thunkAPI) => {
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
            OperationType.MarkNotificationRead,
            arg.notification.customId
        )
    );

    try {
        const readAt = getDateString();
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());

        if (!isDemoMode) {
            const result = await UserAPI.markNotificationRead(
                arg.notification,
                readAt
            );

            if (result && result.errors) {
                throw result.errors;
            }
        }

        // TODO: Should control wait for net call, or should it happen before net call?
        await thunkAPI.dispatch(
            NotificationActions.updateNotification({
                id: arg.notification.customId,
                data: { readAt },
                meta: {
                    arrayUpdateStrategy: "replace",
                },
            })
        );

        await thunkAPI.dispatch(
            dispatchOperationCompleted(
                id,
                OperationType.MarkNotificationRead,
                arg.notification.customId
            )
        );
    } catch (error) {
        await thunkAPI.dispatch(
            dispatchOperationError(
                id,
                OperationType.MarkNotificationRead,
                error,
                arg.notification.customId
            )
        );
    }

    return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
