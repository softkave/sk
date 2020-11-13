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
import { IAppAsyncThunkConfig, IStoreLikeObject } from "../../types";
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
        let responseData: IUpdateCollaborationRequestResponseProps

        if (!isDemoMode) {
            const result = await UserAPI.respondToCollaborationRequest(
                arg.request,
                arg.response
            );

            if (result && result.errors) {
                throw result.errors;
            }

            responseData = result.block;
        } else {
            const blockId = arg.request.from?.blockId;
            let block: IBlock | undefined;

            if (arg.response === CollaborationRequestStatusType.Accepted) {
                block = BlockSelectors.getBlock(thunkAPI.getState(), blockId);
            }

            responseData = {
                customId: arg.request.customId,
                response: arg.response,
                respondedAt: getDateString(),
                org: block
            }
        }

        completeUserNotificationResponse(thunkAPI, {
            customId: arg.request.customId,

        })

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

export interface IUpdateCollaborationRequestResponseProps {
    customId: string;
    response: CollaborationRequestStatusType;
    respondedAt: string;
    org?: IBlock;
}

export const updateNotificationStatus = (
    thunkAPI: IStoreLikeObject,
    arg: IUpdateCollaborationRequestResponseProps
) => {
    thunkAPI.dispatch(
        NotificationActions.updateNotification({
            id: arg.customId,
            data: {
                statusHistory: [
                    {
                        status: arg.response,
                        date: arg.respondedAt,
                    },
                ],
            },
            meta: {
                arrayUpdateStrategy: "concat",
            },
        })
    );
};
export const completeUserNotificationResponse = (thunkAPI: IStoreLikeObject, arg: IUpdateCollaborationRequestResponseProps) => {
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());

    updateNotificationStatus(thunkAPI, arg)

    if (arg.response === CollaborationRequestStatusType.Accepted && arg.org) {
        thunkAPI.dispatch(BlockActions.addBlock(arg.org));
        thunkAPI.dispatch(
            UserActions.updateUser({
                id: user.customId,
                data: { orgs: [{ customId: arg.org.customId }] },
                meta: { arrayUpdateStrategy: "concat" },
            })
        );
    }
