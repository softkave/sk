import { createAsyncThunk } from "@reduxjs/toolkit";
import { omit } from "lodash";
import { toAppErrorsArray } from "../../net/invokeEndpoint";
import { getNewId } from "../../utils/utils";
import KeyValueActions from "../key-value/actions";
import KeyValueSelectors from "../key-value/selectors";
import { ILoadingState } from "../key-value/types";
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
      return operation;
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

export function shouldLoadState(loadingState?: ILoadingState) {
  return !loadingState?.initialized && !loadingState?.isLoading;
}

export interface IAsyncOp02Extras {
  isDemoMode?: boolean;
}

export interface IMakeAsyncOp02Options {
  key: string;
}

export const makeAsyncOp02 = <Arg, Result>(
  type: string,
  fn: (
    arg: Arg & IMakeAsyncOp02Options,
    thunkAPI: IStoreLikeObject,
    extras: IAsyncOp02Extras
  ) => Result | Promise<Result>
) => {
  return createAsyncThunk<
    ILoadingState,
    Arg & { key: string },
    IAppAsyncThunkConfig
  >(type, async (arg, thunkAPI) => {
    const loadingState = KeyValueSelectors.getKey<ILoadingState | undefined>(
      thunkAPI.getState(),
      arg.key
    );

    if (loadingState && shouldLoadState(loadingState)) {
      return loadingState;
    }

    thunkAPI.dispatch(
      KeyValueActions.setLoadingState({
        key: arg.key,
        value: { isLoading: true },
      })
    );

    try {
      const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
      await fn(arg, thunkAPI, { isDemoMode });
      thunkAPI.dispatch(
        KeyValueActions.setLoadingState({
          key: arg.key,
          value: { initialized: true },
        })
      );
    } catch (error) {
      thunkAPI.dispatch(
        KeyValueActions.setLoadingState({
          key: arg.key,
          value: { error: toAppErrorsArray(error) },
        })
      );
    }

    return KeyValueSelectors.getKey<ILoadingState>(
      thunkAPI.getState(),
      arg.key
    );
  });
};

/**
 * Similar to makeAsyncOp02, but with not save the loading state to the store.
 */
export const makeAsyncOp02NoPersist = <Arg, Result>(
  type: string,
  fn: (
    arg: Arg,
    thunkAPI: IStoreLikeObject,
    extras: IAsyncOp02Extras
  ) => Result | Promise<Result>
) => {
  return createAsyncThunk<ILoadingState, Arg, IAppAsyncThunkConfig>(
    type,
    async (arg, thunkAPI) => {
      try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
        await fn(arg, thunkAPI, { isDemoMode });
      } catch (error) {
        return { error: toAppErrorsArray(error) };
      }

      return { initialized: true };
    }
  );
};

export function mergeLoadingStates(
  ...states: Array<ILoadingState | undefined>
) {
  return states.reduce((acc, state) => {
    if (!state) {
      return acc;
    }

    return {
      ...acc,
      ...state,
    };
  }, {}) as ILoadingState;
}

export function removeAsyncOp02Params<T>(
  args: T & Partial<IMakeAsyncOp02Options>
) {
  return omit(args, "key");
}

export function removeAsyncOpParams<T>(
  args: T & Partial<GetOperationActionArgs<{}>>
) {
  return omit(args, "opId", "operationType");
}
