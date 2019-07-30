import { Dispatch } from "redux";

import { INetResult } from "../net/query";
import { AnyFunction, AnyFunctionAsync, IAnyObject } from "../utils/types";
import { filterErrorByBaseName, stripFieldsFromError } from "./FOR";

// TODO: define state's type and others
export interface IPropagateToReduxParams extends IAnyObject {
  state?: any;
  dispatch?: Dispatch;
}

export interface IHandleErrorParams {
  filterBaseNames?: string[];
  stripBaseNames?: string[];
}

export interface IPipeline {
  process?: AnyFunction;
  net: AnyFunctionAsync;
  handleError?: AnyFunction | IHandleErrorParams;
  processResult?: AnyFunction;
  propagate?: AnyFunction;
}

const returnFirstArg = (arg: any) => arg;
const doNothing = () => undefined;

const defaultProcessFunc = returnFirstArg;
const defaultProcessResultFunc = returnFirstArg;
const defaultPropagateFunc = returnFirstArg;
const defaultHandleErrorFunc = doNothing;

const handleErrorWithParams = (
  result: INetResult,
  handleErrorParams: IHandleErrorParams
) => {
  if (result && result.errors) {
    if (handleErrorParams.filterBaseNames) {
      result.errors = filterErrorByBaseName(
        result.errors,
        filterErrorByBaseName
      );
    }

    if (handleErrorParams.stripBaseNames) {
      result.errors = stripFieldsFromError(
        result.errors,
        handleErrorParams.stripBaseNames
      );
    }

    throw result.errors;
  }

  return result;
};

function fillPipeline(methods: IPipeline): Required<IPipeline> {
  return {
    process: defaultProcessFunc,
    handleError: defaultHandleErrorFunc,
    processResult: defaultProcessResultFunc,
    propagate: defaultPropagateFunc,
    ...methods
  };
}

async function main(methods: IPipeline, params: any) {
  const internalMethods = fillPipeline(methods);
  const processedData = internalMethods.process(params);
  let next = { ...params, ...processedData };
  let result = await internalMethods.net(next);

  if (typeof internalMethods.handleError === "function") {
    result = internalMethods.handleError(result);
  } else if (
    typeof internalMethods.handleError === "object" &&
    !Array.isArray(internalMethods.handleError)
  ) {
    result = handleErrorWithParams(result, internalMethods.handleError);
  }

  next = { ...next, ...result };
  next = internalMethods.processResult(next);
  internalMethods.propagate(next);
}

export function makePipeline(methods, initialParams) {
  return async params => {
    return main(methods, { ...initialParams, params });
  };
}
