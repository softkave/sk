import { Dispatch } from "redux";
import { INetError } from "../../net/query";
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

export type DefaultOperationStatusType =
  | typeof operationStarted
  | typeof operationPending
  | typeof operationError
  | typeof operationComplete
  | typeof operationConsumed;

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
  scopeID?: OperationStatusScopeId
) {
  if (operation && Array.isArray(operation.statusHistory)) {
    if (scopeID) {
      const scopeStatuses = getStatusesWithScope(operation, scopeID);

      return scopeStatuses[scopeStatuses.length - 1];
    } else {
      return operation.statusHistory[operation.statusHistory.length - 1];
    }
  }
}

export function getOperationLastError(
  operation?: IOperation,
  scopeID?: OperationStatusScopeId
) {
  if (operation && isOperationError(operation)) {
    const status = getOperationLastStatus(operation, scopeID);

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
  scopeID?: OperationStatusScopeId
) {
  return getOperationLastStatusType(operation, scopeID) === operationStarted;
}

export function isOperationPending(
  operation?: IOperation,
  scopeID?: OperationStatusScopeId
) {
  return getOperationLastStatusType(operation, scopeID) === operationPending;
}

export function isOperationStartedOrPending(
  operation?: IOperation,
  scopeID?: OperationStatusScopeId
) {
  return (
    isOperationStarted(operation, scopeID) ||
    isOperationPending(operation, scopeID)
  );
}

export function isOperationCompleted(
  operation?: IOperation,
  scopeID?: OperationStatusScopeId
) {
  return getOperationLastStatusType(operation, scopeID) === operationComplete;
}

export function isOperationError(
  operation?: IOperation,
  scopeID?: OperationStatusScopeId
) {
  return getOperationLastStatusType(operation, scopeID) === operationError;
}

export function getStatusesWithScope(
  operation: IOperation,
  scopeID: string | number
) {
  return operation.statusHistory.filter((status) => {
    return status.scopeId === scopeID;
  });
}

export interface IOperationFuncOptions {
  resourceId?: string | null;
  scopeId?: string | number;
}

export interface IDispatchOperationFuncProps {
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

export function dispatchOperationStarted(props: IDispatchOperationFuncProps) {
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

export function dispatchOperationPending(props: IDispatchOperationFuncProps) {
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

export function dispatchOperationError(props: IDispatchOperationFuncProps) {
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

export function dispatchOperationComplete(props: IDispatchOperationFuncProps) {
  const { dispatch, operationId, resourceId, data, scopeId: scopeID } = props;
  dispatchOperationStatus(
    dispatch,
    operationId,
    {
      data,
      scopeId: scopeID,
      status: operationStatusTypes.operationComplete,
      timestamp: Date.now(),
    },
    resourceId
  );
}

export const operationHasStatusWithScopeID = (
  operation?: IOperation,
  scopeID?: string
) => {
  if (!operation || !scopeID) {
    return false;
  }

  const statusHistory = operation.statusHistory;
  return statusHistory.findIndex((status) => status.scopeId === scopeID) !== -1;
};
