import { createAsyncThunk } from "@reduxjs/toolkit";
import moment from "moment";
import { BlockType, IBlock } from "../../../models/block/block";
import {
    CollaborationRequestStatusType,
    INotification,
    NotificationType,
} from "../../../models/notification/notification";
import { IAddCollaboratorFormItemValues } from "../../../models/types";
import BlockAPI from "../../../net/block";
import { getDateString, newId } from "../../../utils/utils";
import BlockActions from "../../blocks/actions";
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

export interface IAddCollaboratorsOperationActionArgs {
    block: IBlock;

    // TODO: better declare type, don't rely on form values
    collaborators: IAddCollaboratorFormItemValues[];
    message?: string;
    expiresAt?: number | Date;
}

export const addCollaboratorsOperationAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<IAddCollaboratorsOperationActionArgs>,
    IAppAsyncThunkConfig
>("block/addCollaborators", async (arg, thunkAPI) => {
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
            OperationType.AddCollaborators,
            arg.block.customId
        )
    );

    try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
        const proccessedRequests = arg.collaborators.map((request) => {
            const requestExpiresAt = request.expiresAt || arg.expiresAt;

            return {
                ...request,
                body: request.body || arg.message!,
                expiresAt: requestExpiresAt
                    ? moment(requestExpiresAt).valueOf()
                    : undefined,
                customId: newId(),
            };
        });

        const user = SessionSelectors.getSignedInUserRequired(
            thunkAPI.getState()
        );

        if (!isDemoMode) {
            const result = await BlockAPI.addCollaborators(
                arg.block,
                proccessedRequests
            );

            if (result && result.errors) {
                throw result.errors;
            }
        } else {
            const requests: INotification[] = proccessedRequests.map((req) => {
                return {
                    body: req.body,
                    createdAt: getDateString(),
                    customId: newId(),
                    to: {
                        email: req.email,
                    },
                    type: NotificationType.CollaborationRequest,
                    expiresAt: req.expiresAt
                        ? getDateString(req.expiresAt)
                        : undefined,
                    from: {
                        blockId: arg.block.customId,
                        blockName: arg.block.name!,
                        blockType: BlockType.Org,
                        name: user.name,
                        userId: user.customId,
                    },
                    statusHistory: [
                        {
                            status: CollaborationRequestStatusType.Pending,
                            date: getDateString(),
                        },
                    ],
                };
            });

            thunkAPI.dispatch(
                NotificationActions.bulkAddNotifications(requests)
            );

            thunkAPI.dispatch(
                BlockActions.updateBlock({
                    id: arg.block.customId,
                    data: {
                        notifications: requests.map((req) => req.customId),
                    },
                    meta: { arrayUpdateStrategy: "concat" },
                })
            );
        }

        await thunkAPI.dispatch(
            dispatchOperationCompleted(
                id,
                OperationType.AddCollaborators,
                arg.block.customId
            )
        );
    } catch (error) {
        await thunkAPI.dispatch(
            dispatchOperationError(
                id,
                OperationType.AddCollaborators,
                error,
                arg.block.customId
            )
        );
    }

    return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
