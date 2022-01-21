import { createAsyncThunk } from "@reduxjs/toolkit";
import { IBlock } from "../../models/block/block";
import { toAppErrorsArray } from "../../net/invokeEndpoint";
import { getNewId } from "../../utils/utils";
import SessionSelectors from "../session/selectors";
import { IAppAsyncThunkConfig, IStoreLikeObject } from "../types";
import {
    IOperation,
    isOperationStarted,
    dispatchOperationStarted,
    dispatchOperationError,
    wrapUpOpAction,
    OperationStatus,
} from "./operation";
import OperationType from "./OperationType";
import OperationSelectors from "./selectors";
import { GetOperationActionArgs } from "./types";

export interface IAsyncOpExtras {
    isDemoMode?: boolean;
}

export interface IMakeAsyncOpOptions {}

export const makeAsyncOp = <Arg>(
    type: string,
    operationType: OperationType,
    fn: (
        arg: Arg,
        thunkAPI: IStoreLikeObject,
        extras: IAsyncOpExtras
    ) => void | Promise<void>,
    options: IMakeAsyncOpOptions = {}
) => {
    return createAsyncThunk<
        IOperation<IBlock> | undefined,
        GetOperationActionArgs<Arg>,
        IAppAsyncThunkConfig
    >(type, async (arg, thunkAPI) => {
        const opId = arg.opId || getNewId();
        const operation = OperationSelectors.getOperationWithId(
            thunkAPI.getState(),
            opId
        );

        if (isOperationStarted(operation)) {
            return;
        }

        thunkAPI.dispatch(dispatchOperationStarted(opId, operationType));

        try {
            const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
            await fn(arg, thunkAPI, { isDemoMode });
        } catch (error) {
            thunkAPI.dispatch(
                dispatchOperationError(opId, operationType, error)
            );
        }

        return wrapUpOpAction(thunkAPI, opId, arg);
    });
};

export interface IMakeAsyncOpOptionsWithoutDispatch<Arg> {
    preFn?: (arg: Arg) => {
        resourceId: string;
    };
}

export const makeAsyncOpWithoutDispatch = <Arg, Result>(
    type: string,
    operationType: OperationType,
    fn: (
        arg: Arg,
        thunkAPI: IStoreLikeObject,
        extras: IAsyncOpExtras
    ) => Result | Promise<Result>,
    options: IMakeAsyncOpOptionsWithoutDispatch<Arg> = {}
) => {
    return createAsyncThunk<
        IOperation<IBlock> | undefined,
        GetOperationActionArgs<Arg>,
        IAppAsyncThunkConfig
    >(type, async (arg, thunkAPI) => {
        const preFnResult = options.preFn && options.preFn(arg);
        let operation: IOperation = {
            operationType,
            id: getNewId(),
            status: { status: OperationStatus.Started, timestamp: Date.now() },
            resourceId: preFnResult?.resourceId,
        };

        try {
            const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
            const result = await fn(arg, thunkAPI, { isDemoMode });
            operation = {
                ...operation,
                status: {
                    status: OperationStatus.Completed,
                    timestamp: Date.now(),
                    data: result,
                },
            };
        } catch (error) {
            operation = {
                ...operation,
                status: {
                    error: toAppErrorsArray(error),
                    status: OperationStatus.Error,
                    timestamp: Date.now(),
                },
            };
        }

        return operation;
    });
};
