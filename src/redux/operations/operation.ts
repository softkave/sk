import { Dispatch } from "redux";
import { pushOperation } from "./actions";

const operationStarted = "started";
const operationPending = "pending";
const operationComplete = "complete";
const operationError = "error";

export const defaultOperationStatusTypes = {
  operationStarted,
  operationPending,
  operationError,
  operationComplete
};

export type DefaultOperationStatusType =
  | typeof operationStarted
  | typeof operationPending
  | typeof operationError
  | typeof operationComplete;

export interface IOperationStatus<StatusType extends string = string> {
  status: StatusType;
  timestamp: number;
  data?: any;
  meta?: any;
}

export default interface IOperation<
  StatusType extends string = string,
  OperationStatus extends IOperationStatus<StatusType> = IOperationStatus<
    StatusType
  >
> {
  operationID: string;
  operationStatusHistory: OperationStatus[];
  resourceID?: string;
}

export function getOperationLastStatus(operation: IOperation) {
  return operation.operationStatusHistory[
    operation.operationStatusHistory.length - 1
  ];
}

export function getOperationStatusesWithType(
  operation: IOperation,
  statusType: string
) {
  return operation.operationStatusHistory.filter(status => {
    return status.status === statusType;
  });
}

export function getOperationLastStatusType(operation: IOperation) {
  const lastStatus = getOperationLastStatus(operation);

  return lastStatus ? lastStatus.status : null;
}

export function isOperationStarted(operation: IOperation) {
  return getOperationLastStatusType(operation) === operationStarted;
}

export function isOperationPending(operation: IOperation) {
  return getOperationLastStatusType(operation) === operationPending;
}

export function isOperationCompleted(operation: IOperation) {
  return getOperationLastStatusType(operation) === operationComplete;
}

export function isOperationError(operation: IOperation) {
  return getOperationLastStatusType(operation) === operationError;
}

export function makeOperationStatus(
  statusType: string,
  data?: any,
  meta?: any
): IOperationStatus {
  return {
    data,
    meta,
    status: statusType,
    timestamp: Date.now()
  };
}

function dispatchOperationStatus(
  dispatch: Dispatch,
  operationID: string,
  statusType: string,
  resourceID?: string | null,
  data?: any,
  meta?: any
) {
  dispatch(
    pushOperation(
      operationID,
      makeOperationStatus(statusType, data, meta),
      resourceID
    )
  );
}

export function dispatchOperationStarted(
  dispatch: Dispatch,
  operationID: string,
  resourceID?: string | null,
  data?: any,
  meta?: any
) {
  dispatchOperationStatus(
    dispatch,
    operationID,
    defaultOperationStatusTypes.operationStarted,
    resourceID,
    data,
    meta
  );
}

export function dispatchOperationPending(
  dispatch: Dispatch,
  operationID: string,
  resourceID?: string | null,
  data?: any,
  meta?: any
) {
  dispatchOperationStatus(
    dispatch,
    operationID,
    defaultOperationStatusTypes.operationPending,
    resourceID,
    data,
    meta
  );
}

export function dispatchOperationError(
  dispatch: Dispatch,
  operationID: string,
  resourceID?: string | null,
  data?: any,
  meta?: any
) {
  dispatchOperationStatus(
    dispatch,
    operationID,
    defaultOperationStatusTypes.operationError,
    resourceID,
    data,
    meta
  );
}

export function dispatchOperationComplete(
  dispatch: Dispatch,
  operationID: string,
  resourceID?: string | null,
  data?: any,
  meta?: any
) {
  dispatchOperationStatus(
    dispatch,
    operationID,
    defaultOperationStatusTypes.operationComplete,
    resourceID,
    data,
    meta
  );
}
