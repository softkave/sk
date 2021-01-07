import { createAsyncThunk } from "@reduxjs/toolkit";
import { IBoardSprintOptions } from "../../../models/sprint/types";
import SprintAPI, { ISetupSprintsAPIParams } from "../../../net/sprint/sprint";
import { getDateString, getNewId } from "../../../utils/utils";
import BlockActions from "../../blocks/actions";
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

export const setupSprintsOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<ISetupSprintsAPIParams>,
    IAppAsyncThunkConfig
>("op/sprint/setupSprints", async (arg, thunkAPI) => {
    const opId = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        opId
    );

    if (isOperationStarted(operation)) {
        return;
    }

    await thunkAPI.dispatch(
        dispatchOperationStarted(opId, OperationType.SetupSprints, arg.boardId)
    );

    try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
        const user = SessionSelectors.assertGetUser(thunkAPI.getState());
        const sprintOptions: IBoardSprintOptions = {
            duration: arg.data.duration,
            createdAt: getDateString(),
            createdBy: user.customId,
        };

        if (!isDemoMode) {
            const result = await SprintAPI.setupSprint(arg);

            if (result && result.errors) {
                throw result.errors;
            }

            sprintOptions.createdAt = result.sprintOptions.createdAt;
        }

        thunkAPI.dispatch(
            BlockActions.updateBlock({
                id: arg.boardId,
                data: {
                    sprintOptions,
                },
            })
        );

        thunkAPI.dispatch(
            dispatchOperationCompleted(
                opId,
                OperationType.SetupSprints,
                arg.boardId
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                opId,
                OperationType.SetupSprints,
                error,
                arg.boardId
            )
        );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
});
