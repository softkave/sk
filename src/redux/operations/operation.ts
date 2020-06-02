import { Dispatch } from "redux";
import { INetError } from "../../net/types";
import { pushOperation } from "./actions";

const operationStarted = "started";
const operationPending = "pending";
const operationComplete = "complete";
const operationConsumed = "consumed";
const operationError = "error";

export const operationStatusTypes = {
  operationStarted,
  operationPending,
  operationError,
  operationComplete,
  consumed: operationConsumed,
};

export enum OperationStatus {
  Started = "started",
  Pending = "pending",
  Error = "error",
  Complete = "complete",
  Consumed = "consumed",
}

export type OperationStatusScopeId = string | number;
export interface IOperationStatus<StatusType extends string = string> {
  status: StatusType;
  timestamp: number;
  scopeId?: string | number;
  data?: any;
  error?: INetError | Error;
}

export default interface IOperation<
  StatusType extends string = string,
  OperationStatus extends IOperationStatus<StatusType> = IOperationStatus<
    StatusType
  >
> {
  operationId: string;
  statusHistory: OperationStatus[];
  resourceId?: string | null;
}

export function sortStatusesByTimestamp(statuses: IOperationStatus[]) {
  return statuses.sort((status1, status2) => {
    if (status1.timestamp < status2.timestamp) {
      return -1;
    } else if (status1.timestamp > status2.timestamp) {
      return 1;
    } else {
      return 0;
    }
  });
}

export function getOperationLastStatus(
  operation?: IOperation,
  scopeId?: OperationStatusScopeId
) {
  if (operation && Array.isArray(operation.statusHistory)) {
    if (scopeId) {
      const scopeStatuses = getStatusesWithScope(operation, scopeId);

      return scopeStatuses[scopeStatuses.length - 1];
    } else {
      return operation.statusHistory[operation.statusHistory.length - 1];
    }
  }
}

export function getOperationLastError(
  operation?: IOperation,
  scopeId?: OperationStatusScopeId
) {
  if (operation && isOperationError(operation)) {
    const status = getOperationLastStatus(operation, scopeId);

    if (status) {
      return status.error;
    }
  }
}

export function getOperationLastStatusType(
  operation?: IOperation,
  scopeId?: OperationStatusScopeId
) {
  const lastStatus = getOperationLastStatus(operation, scopeId);
  return lastStatus && lastStatus.status;
}

export function isStatusTypeStarted(status: IOperationStatus) {
  return status.status === operationStarted;
}

export function isStatusTypePending(status: IOperationStatus) {
  return status.status === operationPending;
}

export function isStatusTypeCompleted(status: IOperationStatus) {
  return status.status === operationComplete;
}

export function isStatusTypeError(status: IOperationStatus) {
  return status.status === operationError;
}

export function isOperationStarted(
  operation?: IOperation,
  scopeId?: OperationStatusScopeId
) {
  return getOperationLastStatusType(operation, scopeId) === operationStarted;
}

export function isOperationPending(
  operation?: IOperation,
  scopeId?: OperationStatusScopeId
) {
  return getOperationLastStatusType(operation, scopeId) === operationPending;
}

export function isOperationStartedOrPending(
  operation?: IOperation,
  scopeId?: OperationStatusScopeId
) {
  return (
    isOperationStarted(operation, scopeId) ||
    isOperationPending(operation, scopeId)
  );
}

export function isOperationCompleted(
  operation?: IOperation,
  scopeId?: OperationStatusScopeId
) {
  return getOperationLastStatusType(operation, scopeId) === operationComplete;
}

export function isOperationError(
  operation?: IOperation,
  scopeId?: OperationStatusScopeId
) {
  return getOperationLastStatusType(operation, scopeId) === operationError;
}

export function getStatusesWithScope(
  operation: IOperation,
  scopeId: string | number
) {
  return operation.statusHistory.filter((status) => {
    return status.scopeId === scopeId;
  });
}

export interface IOperationFuncOptions {
  resourceId?: string | null;
  scopeId?: string | number;
}

export interface IdispatchOperationFuncProps {
  dispatch: Dispatch;
  operationId: string;
  resourceId?: string | null;
  data?: any;
  scopeId?: string | number;
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

export function dispatchOperationStarted(props: IdispatchOperationFuncProps) {
  const { dispatch, operationId, resourceId, data, scopeId } = props;
  dispatchOperationStatus(
    dispatch,
    operationId,
    {
      data,
      scopeId,
      status: operationStatusTypes.operationStarted,
      timestamp: Date.now(),
    },
    resourceId
  );
}

export function dispatchOperationPending(props: IdispatchOperationFuncProps) {
  const { dispatch, operationId, resourceId, data, scopeId } = props;
  dispatchOperationStatus(
    dispatch,
    operationId,
    {
      data,
      scopeId,
      status: operationStatusTypes.operationPending,
      timestamp: Date.now(),
    },
    resourceId
  );
}

export function dispatchOperationError(props: IdispatchOperationFuncProps) {
  const { dispatch, operationId, resourceId, data, scopeId, error } = props;
  dispatchOperationStatus(
    dispatch,
    operationId,
    {
      data,
      scopeId,
      error,
      status: operationStatusTypes.operationError,
      timestamp: Date.now(),
    },
    resourceId
  );
}

export function dispatchOperationComplete(props: IdispatchOperationFuncProps) {
  const { dispatch, operationId, resourceId, data, scopeId: scopeId } = props;
  dispatchOperationStatus(
    dispatch,
    operationId,
    {
      data,
      scopeId: scopeId,
      status: operationStatusTypes.operationComplete,
      timestamp: Date.now(),
    },
    resourceId
  );
}

export const operationHasStatusWithScopeId = (
  operation?: IOperation,
  scopeId?: string
) => {
  if (!operation || !scopeId) {
    return false;
  }

  const statusHistory = operation.statusHistory;
  return statusHistory.findIndex((status) => status.scopeId === scopeId) !== -1;
};
