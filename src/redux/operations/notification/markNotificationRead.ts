import { createAsyncThunk } from "@reduxjs/toolkit";
import { INotification } from "../../../models/notification/notification";
import UserAPI from "../../../net/user/user";
import { getDateString, getNewId } from "../../../utils/utils";
import NotificationActions from "../../notifications/actions";
import SessionSelectors from "../../session/selectors";
import { IAppAsyncThunkConfig } from "../../types";
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
import { GetOperationActionArgs } from "../types";

export interface IMarkNotificationReadOperationActionArgs {
    notification: INotification;
}

export const markNotificationReadOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<IMarkNotificationReadOperationActionArgs>,
    IAppAsyncThunkConfig
>("op/notification/markNotificationRead", async (arg, thunkAPI) => {
    const opId = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        opId
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(
            opId,
            OperationType.MarkNotificationRead,
            arg.notification.customId
        )
    );

    try {
        const readAt = getDateString();
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());

        if (!isDemoMode) {
            const result = await UserAPI.markNotificationRead({
                readAt,
                notificationId: arg.notification.customId,
            });

            if (result && result.errors) {
                throw result.errors;
            }
        }

        // TODO: Should control wait for net call, or should it happen before net call?
        thunkAPI.dispatch(
            NotificationActions.updateNotification({
                id: arg.notification.customId,
                data: { readAt },
                meta: {
                    arrayUpdateStrategy: "replace",
                },
            })
        );

        thunkAPI.dispatch(
            dispatchOperationCompleted(
                opId,
                OperationType.MarkNotificationRead,
                arg.notification.customId
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                opId,
                OperationType.MarkNotificationRead,
                error,
                arg.notification.customId
            )
        );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
});
