import { createAsyncThunk } from "@reduxjs/toolkit";
import { canRespondToNotification } from "../../../components/notification/utils";
import { IBlock } from "../../../models/block/block";
import {
    CollaborationRequestResponse,
    CollaborationRequestStatusType,
    INotification,
} from "../../../models/notification/notification";
import UserAPI from "../../../net/user/user";
import { getDateString, getNewId } from "../../../utils/utils";
import BlockActions from "../../blocks/actions";
import BlockSelectors from "../../blocks/selectors";
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
import { GetOperationActionArgs } from "../types";

export interface IRespondToNotificationOperationActionArgs {
    request: INotification;
    response: CollaborationRequestResponse;
}

export const respondToNotificationOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<IRespondToNotificationOperationActionArgs>,
    IAppAsyncThunkConfig
>("op/notification/respondToNotification", async (arg, thunkAPI) => {
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
            OperationType.RespondToNotification,
            arg.request.customId
        )
    );

    try {
        if (canRespondToNotification(arg.request)) {
            throw new Error("Request not valid");
        }

        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
        let org: IBlock | undefined;
        let respondedAt: string = getDateString();

        if (!isDemoMode) {
            const result = await UserAPI.respondToCollaborationRequest({
                requestId: arg.request.customId,
                response: arg.response,
            });

            if (result && result.errors) {
                throw result.errors;
            }

            org = result.block;
            respondedAt = result.respondedAt;
        } else {
            const blockId = arg.request.from?.blockId;

            if (arg.response === CollaborationRequestStatusType.Accepted) {
                org = BlockSelectors.getBlock(thunkAPI.getState(), blockId);
            }
        }

        completeUserNotificationResponse(
            thunkAPI,
            arg.request.customId,
            arg.response,
            respondedAt,
            org
        );

        thunkAPI.dispatch(
            dispatchOperationCompleted(
                opId,
                OperationType.RespondToNotification,
                arg.request.customId
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                opId,
                OperationType.RespondToNotification,
                error,
                arg.request.customId
            )
        );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
});

export const updateNotificationStatus = (
    store: IStoreLikeObject,
    requestId: string,
    response: CollaborationRequestStatusType,
    respondedAt: string
) => {
    store.dispatch(
        NotificationActions.updateNotification({
            id: requestId,
            data: {
                statusHistory: [
                    {
                        status: response,
                        date: respondedAt,
                    },
                ],
            },
            meta: {
                arrayUpdateStrategy: "concat",
            },
        })
    );
};

export const completeUserNotificationResponse = (
    store: IStoreLikeObject,
    requestId: string,
    response: CollaborationRequestStatusType,
    respondedAt: string,
    org?: IBlock
) => {
    const user = SessionSelectors.assertGetUser(store.getState());

    updateNotificationStatus(store, requestId, response, respondedAt);

    if (response === CollaborationRequestStatusType.Accepted && org) {
        store.dispatch(BlockActions.addBlock(org));
        store.dispatch(
            UserActions.updateUser({
                id: user.customId,
                data: { orgs: [{ customId: org.customId }] },
                meta: { arrayUpdateStrategy: "concat" },
            })
        );
    }
};
