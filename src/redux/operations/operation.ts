import { Dispatch } from "redux";
import OperationError from "../../utils/operation-error/OperationError";
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
  error?: OperationError;
}

export default interface IOperation<
  StatusType extends string = string,
  OperationStatus extends IOperationStatus<StatusType> = IOperationStatus<
    StatusType
  >
> {
  operationID: string;
  statusHistory: OperationStatus[];
  resourceID?: string | null;
}

export function getOperationLastStatus(operation: IOperation) {
  return operation.statusHistory[operation.statusHistory.length - 1];
}

export function getOperationStatusesWithType(
  operation: IOperation,
  statusType: string
) {
  return operation.statusHistory.filter(status => {
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
  error?: OperationError
): IOperationStatus {
  return {
    data,
    error,
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
  error?: OperationError
) {
  dispatch(
    pushOperation(
      operationID,
      makeOperationStatus(statusType, data, error),
      resourceID
    )
  );
}

export function dispatchOperationStarted(
  dispatch: Dispatch,
  operationID: string,
  resourceID?: string | null,
  data?: any
) {
  dispatchOperationStatus(
    dispatch,
    operationID,
    defaultOperationStatusTypes.operationStarted,
    resourceID,
    data
  );
}

export function dispatchOperationPending(
  dispatch: Dispatch,
  operationID: string,
  resourceID?: string | null,
  data?: any
) {
  dispatchOperationStatus(
    dispatch,
    operationID,
    defaultOperationStatusTypes.operationPending,
    resourceID,
    data
  );
}

export function dispatchOperationError(
  dispatch: Dispatch,
  operationID: string,
  resourceID?: string | null,
  error?: OperationError,
  data?: any
) {
  dispatchOperationStatus(
    dispatch,
    operationID,
    defaultOperationStatusTypes.operationError,
    resourceID,
    data,
    error
  );
}

export function dispatchOperationComplete(
  dispatch: Dispatch,
  operationID: string,
  resourceID?: string | null,
  data?: any
) {
  dispatchOperationStatus(
    dispatch,
    operationID,
    defaultOperationStatusTypes.operationComplete,
    resourceID,
    data
  );
}
