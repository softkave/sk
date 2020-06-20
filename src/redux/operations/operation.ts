import { Dispatch } from "redux";
import { INetError } from "../../net/types";
import { pushOperation } from "./actions";

export enum OperationStatus {
  Started = "started",
  Pending = "pending",
  Error = "error",
  Completed = "completed",
  Consumed = "consumed",
}

export type OperationStatusScopeId = string | number;
export interface IOperationStatus {
  status: OperationStatus;
  timestamp: number;
  data?: any;
  error?: any;
}

export default interface IOperation {
  operationId: string;
  status: IOperationStatus;
  resourceId?: string | null;
}

export function sortOperationsByTimestamp(operations: IOperation[]) {
  return operations.sort((operation1, operation2) => {
    if (operation1.status.timestamp < operation2.status.timestamp) {
      return -1;
    } else if (operation1.status.timestamp > operation2.status.timestamp) {
      return 1;
    } else {
      return 0;
    }
  });
}

export function isOperationStarted(operation?: IOperation) {
  return operation?.status.status === OperationStatus.Started;
}

export function isOperationPending(operation?: IOperation) {
  return operation?.status.status === OperationStatus.Pending;
}

export function isOperationStartedOrPending(operation?: IOperation) {
  return isOperationStarted(operation) || isOperationPending(operation);
}

export function isOperationCompleted(operation?: IOperation) {
  return operation?.status.status === OperationStatus.Completed;
}

export function isOperationError(operation?: IOperation) {
  return operation?.status.status === OperationStatus.Error;
}

export function isOperationConsumed(operation?: IOperation) {
  return operation?.status.status === OperationStatus.Consumed;
}

export interface IOperationFuncOptions {
  resourceId?: string | null;
}

export interface IDispatchOperationFuncProps {
  dispatch: Dispatch;
  operationId: string;
  resourceId?: string | null;
  data?: any;
  error?: INetError | Error;
}

function dispatchOperationStatus(
  dispatch: Dispatch,
  operationId: string,
  status: IOperationStatus,
  resourceId?: string | null
) {
  dispatch(pushOperation(operationId, status, resourceId));
}

export function dispatchOperationStarted(props: IDispatchOperationFuncProps) {
  const { dispatch, operationId, resourceId, data } = props;
  dispatchOperationStatus(
    dispatch,
    operationId,
    {
      data,
      status: OperationStatus.Started,
      timestamp: Date.now(),
    },
    resourceId
  );
}

export function dispatchOperationPending(props: IDispatchOperationFuncProps) {
  const { dispatch, operationId, resourceId, data } = props;
  dispatchOperationStatus(
    dispatch,
    operationId,
    {
      data,
      status: OperationStatus.Pending,
      timestamp: Date.now(),
    },
    resourceId
  );
}

export function dispatchOperationError(props: IDispatchOperationFuncProps) {
  const { dispatch, operationId, resourceId, data, error } = props;
  dispatchOperationStatus(
    dispatch,
    operationId,
    {
      data,
      error,
      status: OperationStatus.Error,
      timestamp: Date.now(),
    },
    resourceId
  );
}

export function dispatchOperationComplete(props: IDispatchOperationFuncProps) {
  const { dispatch, operationId, resourceId, data } = props;
  dispatchOperationStatus(
    dispatch,
    operationId,
    {
      data,
      status: OperationStatus.Completed,
      timestamp: Date.now(),
    },
    resourceId
  );
}
