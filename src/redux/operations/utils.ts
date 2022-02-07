import { createAsyncThunk } from "@reduxjs/toolkit";
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
  dispatchOperationCompleted,
} from "./operation";
import OperationType from "./OperationType";
import OperationSelectors from "./selectors";
import { GetOperationActionArgs } from "./types";

export interface IAsyncOpExtras<Arg> {
  isDemoMode?: boolean;
  props: GetOperationActionArgs<Arg>;
}

export interface IMakeAsyncOpOptions<Arg> {
  preFn?: (arg: GetOperationActionArgs<Arg>) => {
    resourceId: string;
  };
}

export const makeAsyncOp = <Arg, Result>(
  type: string,
  operationType: OperationType,
  fn: (
    arg: Arg,
    thunkAPI: IStoreLikeObject,
    extras: IAsyncOpExtras<Arg>
  ) => Result | Promise<Result>,
  options: IMakeAsyncOpOptions<Arg> = {}
) => {
  return createAsyncThunk<
    IOperation<Result> | undefined,
    GetOperationActionArgs<Arg>,
    IAppAsyncThunkConfig
  >(type, async (arg, thunkAPI) => {
    const preFnResult = options.preFn && options.preFn(arg);
    const opId = arg.opId || getNewId();
    const operation = OperationSelectors.getOperationWithId(
      thunkAPI.getState(),
      opId
    );

    if (isOperationStarted(operation)) {
      return;
    }

    thunkAPI.dispatch(
      dispatchOperationStarted(opId, operationType, preFnResult?.resourceId)
    );

    try {
      const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());

      // TODO: if the workings of GetOperationActionArgs ever changes, update
      // the types here as required
      const result = await fn(arg as Arg, thunkAPI, { isDemoMode, props: arg });
      thunkAPI.dispatch(
        dispatchOperationCompleted(
          opId,
          operationType,
          preFnResult?.resourceId,
          result
        )
      );
    } catch (error) {
      thunkAPI.dispatch(
        dispatchOperationError(
          opId,
          operationType,
          toAppErrorsArray(error),
          preFnResult?.resourceId
        )
      );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
  });
};

export interface IMakeAsyncOpOptionsWithoutDispatch<Arg> {
  preFn?: (arg: GetOperationActionArgs<Arg>) => {
    resourceId: string;
  };
}

export const makeAsyncOpWithoutDispatch = <Arg, Result>(
  type: string,
  operationType: OperationType,
  fn: (
    arg: Arg,
    thunkAPI: IStoreLikeObject,
    extras: IAsyncOpExtras<Arg>
  ) => Result | Promise<Result>,
  options: IMakeAsyncOpOptionsWithoutDispatch<Arg> = {}
) => {
  return createAsyncThunk<
    IOperation<Result> | undefined,
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
      const result = await fn(arg as Arg, thunkAPI, { isDemoMode, props: arg });
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
