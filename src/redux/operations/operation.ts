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

export function hasOperationStarted(operation: IOperation) {
  return getOperationLastStatusType(operation) === operationStarted;
}

export function isOperationPending(operation: IOperation) {
  return getOperationLastStatusType(operation) === operationPending;
}

export function hasOperationCompleted(operation: IOperation) {
  return getOperationLastStatusType(operation) === operationComplete;
}

export function isOperationInError(operation: IOperation) {
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
