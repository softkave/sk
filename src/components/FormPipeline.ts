// TODO: delete pipelines
import { Dispatch } from "redux";

import { INetResult } from "../net/query";
import {
  filterErrorByBaseName,
  replaceErrorBaseName,
  stripFieldsFromError
} from "../redux/operations/error";
import { IReduxState } from "../redux/store";
import { IAnyObject } from "../utils/types";

export interface IHandleErrorParams {
  filterBaseNames?: string[];
  stripBaseNames?: string[];
  replaceBaseNames?: Array<{ from: string; to: string }>;
}

// OperatingDataType
// ParamsType
// ProcessedParamsType
// ResultType
// ProcessedResultType

interface IPipelineOperatingData<ParamType = any, ResultType = any> {
  params: ParamType;
  result: ResultType;

  // TODO: Define state's type
  state: IReduxState;
  dispatch: Dispatch;
}

export interface IPipeline<
  ParamsType,
  ProcessedParamType,
  ResultType extends INetResult | null | undefined,
  ProcessedResultType = ResultType
> {
  process?: (
    args: IPipelineOperatingData<ParamsType, null>
  ) => ProcessedParamType;

  net: (
    args: IPipelineOperatingData<ProcessedParamType, null>
  ) => Promise<ResultType>;

  // handleError?: (args: ResultType) => ResultType | IHandleErrorParams;
  handleError?: IHandleErrorParams;

  processResult?: (
    args: IPipelineOperatingData<ProcessedParamType, ResultType>
  ) => ProcessedResultType;

  redux?: (
    args: IPipelineOperatingData<ProcessedParamType, ProcessedResultType>
  ) => void;
}

export interface IQuietPipeline extends IPipeline<any, any, any, any> {}

const defaultProcessFunc = (arg: IPipelineOperatingData) => arg.params;
const defaultProcessResultFunc = (arg: IPipelineOperatingData) => arg.result;
const defaultReduxFunc = () => null;
// const defaultHandleErrorFunc = returnFirstArg;

const handleErrorWithParams = (
  result: INetResult,
  handleErrorParams: IHandleErrorParams
) => {
  if (result && result.errors) {
    if (process.env.NODE_ENV === "development") {
      const fieldsPlusErrors = result.errors.map(e => {
        return {
          ...e,
          message: `${e.field} - ${e.message}`
        };
      });

      const logMessageStyle = "color: red;";
      console.log("--------------- start");
      console.log("---------------");
      fieldsPlusErrors.forEach(e => {
        console.log(`%c ${e.message}`, logMessageStyle);
      });
      console.log("---------------");
      console.log("--------------- end");
    }

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

    if (handleErrorParams.replaceBaseNames) {
      result.errors = replaceErrorBaseName(
        result.errors,
        handleErrorParams.replaceBaseNames
      );
    }

    throw result.errors;
  }

  return result;
};

function fillPipeline(methods: IQuietPipeline): Required<IQuietPipeline> {
  return {
    process: defaultProcessFunc,
    // handleError: defaultHandleErrorFunc,
    handleError: {},
    processResult: defaultProcessResultFunc,
    redux: defaultReduxFunc,
    ...methods
  };
}

async function main(
  methods: IQuietPipeline,
  operatingData: IPipelineOperatingData & IAnyObject
) {
  const internalMethods = fillPipeline(methods);
  // console.log({ operatingData });
  const processedData = internalMethods.process(operatingData);
  // console.log({ processedData });
  let next = { ...operatingData, params: processedData };
  // console.log({ next: JSON.parse(JSON.stringify(next)) });
  let result = await internalMethods.net(next);

  // console.log({ result: JSON.parse(JSON.stringify(result)) });

  result = handleErrorWithParams(result, internalMethods.handleError);

  // console.log({ handledError: JSON.parse(JSON.stringify(result)) });

  next = { ...next, result };
  const finalResult = internalMethods.processResult(next);

  // console.log({ finalResult: JSON.parse(JSON.stringify(result)) });

  next = { ...next, result: finalResult };
  internalMethods.redux(next);
}

export type PipelineEntryFunc<ParamType> = (
  params?: ParamType
) => Promise<void>;

export function makePipeline<ParamType>(
  methods: IQuietPipeline,
  initialOperatingData: object
): PipelineEntryFunc<ParamType> {
  return async (params?: ParamType) => {
    return await main(methods, {
      ...initialOperatingData,
      params
    } as any);
  };
}
