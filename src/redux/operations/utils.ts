import { createAsyncThunk } from "@reduxjs/toolkit";
import { defaultTo, isObject, omit } from "lodash";
import { SystemResourceType } from "../../models/app/types";
import {
  IEndpointQueryPaginationOptions,
  IPaginatedResultWithData,
  IResourceWithId,
} from "../../models/types";
import { toAppErrorsArray } from "../../net/invokeEndpoint";
import { IEndpointResultBase } from "../../net/types";
import { assertEndpointResult } from "../../net/utils";
import { IAppError } from "../../utils/errors";
import { extractCustomIdList } from "../../utils/utils";
import KeyValueActions from "../key-value/actions";
import KeyValueSelectors from "../key-value/selectors";
import {
  ILoadingState,
  ILoadingStateLoadingListValue,
  LoadingListPayloadValue,
} from "../key-value/types";
import { MapsActions } from "../maps/actions";
import SessionSelectors from "../session/selectors";
import { IAppAsyncThunkConfig, IStoreLikeObject } from "../types";

export function shouldLoadState(state?: ILoadingState) {
  return !state?.initialized && !state?.isLoading && !state?.error;
}

export interface IAsyncOp02FnExtras {
  isDemoMode?: boolean;
  isAnonymousUser?: boolean;
}

export interface IAsyncOp02FnExtraArgs {
  key: string;
}

export interface IMakeAsyncOp02Opts<R = any, A = any> {
  transformError?: (error: IAppError[]) => IAppError[];
  dispatchResultLoadingState?: (
    thunkAPI: IStoreLikeObject,
    arg: A,
    result: R
  ) => void | Promise<void>;
}

/**
 * Uses keys stored in key-value store to track loading state
 */
export const makeAsyncOp02 = <
  Arg,
  Result,
  OpArg extends Arg & { key: string } = Arg & { key: string }
>(
  type: string,
  fn: (
    arg: Arg & IAsyncOp02FnExtraArgs,
    thunkAPI: IStoreLikeObject,
    extras: IAsyncOp02FnExtras
  ) => Result | Promise<Result>,
  opts?: IMakeAsyncOp02Opts<Result, OpArg>
) => {
  return createAsyncThunk<ILoadingState, OpArg, IAppAsyncThunkConfig>(
    type,
    async (arg, thunkAPI) => {
      const loadingState = KeyValueSelectors.getByKey<ILoadingState | undefined>(
        thunkAPI.getState(),
        arg.key
      );

      if (loadingState && loadingState.isLoading) {
        return loadingState;
      }

      thunkAPI.dispatch(
        KeyValueActions.mergeLoadingState({
          key: arg.key,
          value: { isLoading: true },
        })
      );

      try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
        const isAnonymousUser = SessionSelectors.isAnonymousUser(thunkAPI.getState());
        const result = await fn(arg, thunkAPI, { isDemoMode, isAnonymousUser });
        if (opts?.dispatchResultLoadingState) {
          opts.dispatchResultLoadingState(thunkAPI, arg, result);
        } else {
          thunkAPI.dispatch(
            KeyValueActions.mergeLoadingState({
              key: arg.key,
              value: { initialized: true, value: result, isLoading: false },
            })
          );
        }
      } catch (error) {
        let errorList = toAppErrorsArray(error);
        if (opts?.transformError) {
          errorList = opts.transformError(errorList);
        }
        thunkAPI.dispatch(
          KeyValueActions.mergeLoadingState({
            key: arg.key,
            value: { error: errorList, isLoading: false },
          })
        );
      }

      return KeyValueSelectors.assertGetByKey<ILoadingState>(thunkAPI.getState(), arg.key);
    }
  );
};

export type MakeAsyncOp03Fn<Arg> = (
  arg: Arg & IAsyncOp02FnExtraArgs,
  thunkAPI: IStoreLikeObject,
  extras: IAsyncOp02FnExtras
) => Promise<IPaginatedResultWithData<IResourceWithId[]> & IEndpointResultBase>;

export type ToMakeAsyncOp03FnArg<Arg> = Arg & Required<IEndpointQueryPaginationOptions>;

/** For fetching and normalizing paginated lists. */
export const makeAsyncOp03 = <Arg extends Required<IEndpointQueryPaginationOptions>>(
  props: {
    type: string;
    mapKey: SystemResourceType;
    handleMainFn: MakeAsyncOp03Fn<Arg>;
  } & Pick<IMakeAsyncOp02Opts, "transformError">
) => {
  return makeAsyncOp02(
    props.type,
    async (
      arg: Arg & IAsyncOp02FnExtraArgs,
      thunkAPI,
      extras
    ): Promise<LoadingListPayloadValue> => {
      const result = await props.handleMainFn(arg, thunkAPI, extras);
      assertEndpointResult(result);
      const { count, page, pageSize, data: dataList } = result;
      const idList = extractCustomIdList(dataList);
      const index = page * pageSize;
      thunkAPI.dispatch(MapsActions.setList({ key: props.mapKey, list: dataList }));
      return { count, index, idList };
    },
    {
      transformError: props.transformError,
      dispatchResultLoadingState: (thunkAPI, arg, result) => {
        thunkAPI.dispatch(
          KeyValueActions.setLoadingList({
            key: arg.key,
            value: result,
          })
        );
      },
    }
  );
};

export type MakeAsyncOp04Fn<Arg, Others extends Record<string, any> = {}> = (
  arg: Arg & IAsyncOp02FnExtraArgs,
  thunkAPI: IStoreLikeObject,
  extras: IAsyncOp02FnExtras
) => Promise<{ items: IResourceWithId[]; others?: Others }>;

/** For fetching and normalizing lists. */
export const makeAsyncOp04 = <Arg, Others extends Record<string, any> = {}>(props: {
  type: string;
  mapKey: SystemResourceType;
  handleMainFn: MakeAsyncOp04Fn<Arg, Others>;
}) => {
  return makeAsyncOp02(props.type, async (arg: Arg & IAsyncOp02FnExtraArgs, thunkAPI, extras) => {
    const { items, others } = await props.handleMainFn(arg, thunkAPI, extras);
    const idList = items.map((item) => item.customId);
    thunkAPI.dispatch(MapsActions.setList({ key: props.mapKey, list: items }));
    const loadingStateValue: ILoadingStateLoadingListValue = {
      ...defaultTo(others, {}),
      idList,
      count: idList.length,
    };
    return loadingStateValue;
  });
};

/**
 * Similar to makeAsyncOp02, but will not save the loading state to the store.
 */
export const makeAsyncOp02NoPersist = <Arg, Result>(
  type: string,
  fn: (
    arg: Arg,
    thunkAPI: IStoreLikeObject,
    extras: IAsyncOp02FnExtras
  ) => Result | Promise<Result>,
  opts?: {
    transformError(error: IAppError[]): IAppError[];
  }
) => {
  return createAsyncThunk<ILoadingState<Result>, Arg, IAppAsyncThunkConfig>(
    type,
    async (arg, thunkAPI) => {
      let result: Result | undefined;
      let loadingState: ILoadingState = { isLoading: true };
      try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
        const isAnonymousUser = SessionSelectors.isAnonymousUser(thunkAPI.getState());
        result = await fn(arg, thunkAPI, { isDemoMode, isAnonymousUser });
        loadingState = { ...loadingState, initialized: true, value: result, isLoading: false };
      } catch (error) {
        let errorList = toAppErrorsArray(error);
        if (opts?.transformError) {
          errorList = opts.transformError(errorList);
        }
        loadingState = { ...loadingState, error: errorList, isLoading: false };
      }

      return loadingState;
    }
  );
};

export function mergeLoadingStates(...states: Array<ILoadingState | undefined>) {
  return states.reduce((acc, state) => {
    if (!state) return acc;
    return { ...acc, ...state };
  }, {}) as ILoadingState;
}

export function cloneLoadingState<T>(state?: ILoadingState, data?: T): ILoadingState<T> {
  return { initialized: !!data, ...defaultTo(state, {}), value: data ?? state?.value };
}

export function removeAsyncOp02Params<T>(args: T & Partial<IAsyncOp02FnExtraArgs>) {
  return omit(args, "key");
}

export function isLoadingState(state: any): state is ILoadingState {
  return isObject(state);
}
