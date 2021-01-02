import { createAsyncThunk } from "@reduxjs/toolkit";
import { IAddCollaboratorFormItemValues } from "../../../components/collaborator/AddCollaboratorFormItem";
import { BlockType } from "../../../models/block/block";
import {
    CollaborationRequestStatusType,
    INotification,
    NotificationType,
} from "../../../models/notification/notification";
import BlockAPI from "../../../net/block/block";
import { getDateString, getNewId } from "../../../utils/utils";
import BlockActions from "../../blocks/actions";
import BlockSelectors from "../../blocks/selectors";
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
    blockId: string;
    collaborators: IAddCollaboratorFormItemValues[];
    message?: string;
    expiresAt?: number | Date;
}

export const addCollaboratorsOperationAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<IAddCollaboratorsOperationActionArgs>,
    IAppAsyncThunkConfig
>("op/block/addCollaborators", async (arg, thunkAPI) => {
    const id = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        id
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(id, OperationType.ADD_COLLABORATORS)
    );

    try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());

        const user = SessionSelectors.assertGetUser(thunkAPI.getState());
        let requests: INotification[] = [];

        if (!isDemoMode) {
            const result = await BlockAPI.addCollaborators({
                blockId: arg.blockId,
                collaborators: arg.collaborators,
            });

            if (result && result.errors) {
                throw result.errors;
            }

            requests = result.requests;
        } else {
            const block = BlockSelectors.getBlock(
                thunkAPI.getState(),
                arg.blockId
            );

            requests = arg.collaborators.map((req) => {
                return {
                    createdAt: getDateString(),
                    customId: getNewId(),
                    to: {
                        email: req.email,
                    },
                    type: NotificationType.CollaborationRequest,
                    from: {
                        blockId: block.customId,
                        blockName: block.name,
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
        }

        thunkAPI.dispatch(NotificationActions.bulkAddNotifications(requests));

        thunkAPI.dispatch(
            BlockActions.updateBlock({
                id: arg.blockId,
                data: {
                    notifications: requests.map((req) => req.customId),
                },
                meta: { arrayUpdateStrategy: "concat" },
            })
        );

        thunkAPI.dispatch(
            dispatchOperationCompleted(
                id,
                OperationType.ADD_COLLABORATORS,
                arg.blockId
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                id,
                OperationType.ADD_COLLABORATORS,
                error,
                arg.blockId
            )
        );
    }

    return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
