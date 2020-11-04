import { createAsyncThunk } from "@reduxjs/toolkit";
import { canRespondToNotification } from "../../../components/notification/utils";
import { IBlock } from "../../../models/block/block";
import {
    CollaborationRequestStatusType,
    INotification,
} from "../../../models/notification/notification";
import UserAPI from "../../../net/user/user";
import { getDateString, getNewId } from "../../../utils/utils";
import BlockActions from "../../blocks/actions";
import BlockSelectors from "../../blocks/selectors";
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

export const respondToNotificationOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<IRespondToNotificationOperationActionArgs>,
    IAppAsyncThunkConfig
>("op/notification/respondToNotification", async (arg, thunkAPI) => {
    const id = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        id
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(
            id,
            OperationType.RespondToNotification,
            arg.request.customId
        )
    );

    try {
        if (canRespondToNotification(arg.request)) {
            throw new Error("Request not valid");
        }

        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
        let block: IBlock | undefined;

        if (!isDemoMode) {
            const result = await UserAPI.respondToCollaborationRequest(
                arg.request,
                arg.response
            );

            if (result && result.errors) {
                throw result.errors;
            }

            block = result.block;
        } else {
            const blockId = arg.request.from?.blockId;

            if (blockId) {
                block = BlockSelectors.getBlock(thunkAPI.getState(), blockId);
            }
        }

        // dte
        thunkAPI.dispatch(
            completeUserNotificationResponse({
                ...arg,
                block,
            }) as any
        );

        thunkAPI.dispatch(
            dispatchOperationCompleted(
                id,
                OperationType.RespondToNotification,
                arg.request.customId
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
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

export const completePartialNotificationResponse = createAsyncThunk<
    void,
    IRespondToNotificationOperationActionArgs,
    IAppAsyncThunkConfig
>(
    "op/notification/completePartialNotificationResponse",
    async (arg, thunkAPI) => {
        const statusHistory =
            arg.request.statusHistory?.concat({
                status: arg.response,
                date: getDateString(),
            }) || [];

        const update = { statusHistory };

        thunkAPI.dispatch(
            NotificationActions.updateNotification({
                id: arg.request.customId,
                data: update,
                meta: {
                    arrayUpdateStrategy: "replace",
                },
            })
        );
    }
);

export const completeUserNotificationResponse = createAsyncThunk<
    void,
    IRespondToNotificationOperationActionArgs & { block?: IBlock },
    IAppAsyncThunkConfig
>("op/notification/completeUserNotificationResponse", async (arg, thunkAPI) => {
    const { block } = arg;
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());

    // dte
    thunkAPI.dispatch(completePartialNotificationResponse(arg) as any);

    if (arg.response === CollaborationRequestStatusType.Accepted && block) {
        thunkAPI.dispatch(BlockActions.addBlock(block));
        thunkAPI.dispatch(
            UserActions.updateUser({
                id: user.customId,
                data: { orgs: [{ customId: arg.request.from!.blockId }] },
                meta: { arrayUpdateStrategy: "concat" },
            })
        );
    }
});
