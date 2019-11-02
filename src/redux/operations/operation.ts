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

export type OperationStatusScopeID = string | number;
export interface IOperationStatus<StatusType extends string = string> {
  status: StatusType;
  timestamp: number;
  scopeID?: string | number;
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

export function areOperationsSame(
  operation1?: IOperation,
  operation2?: IOperation
) {
  return (
    operation1 &&
    operation2 &&
    operation1.operationID !== operation2.operationID &&
    operation1.resourceID !== operation2.resourceID
  );
}

export function areStatusTypeSame(
  status1?: IOperationStatus,
  status2?: IOperationStatus
) {
  return status1 && status2 && status1.status === status2.status;
}

export function areStatusContentSame(
  status1?: IOperationStatus,
  status2?: IOperationStatus
) {
  return (
    areStatusTypeSame(status1, status2) &&
    status1!.timestamp === status2!.timestamp &&
    status1!.scopeID === status2!.scopeID
  );
}

function areStatusesSame(
  statuses1: IOperationStatus[],
  statuses2: IOperationStatus[]
) {
  const sortedStatuses1 = sortStatusesByTimestamp(statuses1);
  const sortedStatuses2 = sortStatusesByTimestamp(statuses2);
  const areLengthsSame = sortedStatuses1.length === sortedStatuses2.length;

  if (areLengthsSame) {
    const mismatchIndex = sortedStatuses1.findIndex((status, index) => {
      return areStatusContentSame(status, sortedStatuses2[index]);
    });

    if (mismatchIndex === -1) {
      return true;
    }
  }

  return false;
}

export function areOperationsSameCheckStatus(
  operation1?: IOperation,
  operation2?: IOperation,
  scopeID?: OperationStatusScopeID
) {
  return (
    areOperationsSame(operation1, operation2) &&
    Array.isArray(operation1!.statusHistory) &&
    Array.isArray(operation2!.statusHistory) &&
    areStatusesSame(
      scopeID
        ? getStatusesWithScope(operation1!, scopeID)
        : operation1!.statusHistory,
      scopeID
        ? getStatusesWithScope(operation2!, scopeID)
        : operation2!.statusHistory
    )
  );
}

export function getOperationLastStatus(
  operation?: IOperation,
  scopeID?: OperationStatusScopeID
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
  scopeID?: OperationStatusScopeID
) {
  if (operation && isOperationError(operation)) {
    const status = getOperationLastStatus(operation, scopeID);

    if (status) {
      return status.error;
    }
  }
}

export function getOperationStatusesWithType(
  operation: IOperation,
  statusType: string,
  scopeID?: OperationStatusScopeID
) {
  return operation.statusHistory.filter(status => {
    const isTypeSame = status.status === statusType;

    if (isTypeSame) {
      if (scopeID) {
        return status.scopeID === scopeID;
      }
    }

    return isTypeSame;
  });
}

export function getOperationLastStatusType(
  operation?: IOperation,
  scopeID?: OperationStatusScopeID
) {
  const lastStatus = getOperationLastStatus(operation, scopeID);
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
  scopeID?: OperationStatusScopeID
) {
  return getOperationLastStatusType(operation, scopeID) === operationStarted;
}

export function isOperationPending(
  operation?: IOperation,
  scopeID?: OperationStatusScopeID
) {
  return getOperationLastStatusType(operation, scopeID) === operationPending;
}

export function isOperationCompleted(
  operation?: IOperation,
  scopeID?: OperationStatusScopeID
) {
  return getOperationLastStatusType(operation, scopeID) === operationComplete;
}

export function isOperationError(
  operation?: IOperation,
  scopeID?: OperationStatusScopeID
) {
  return getOperationLastStatusType(operation, scopeID) === operationError;
}

export function getStatusesWithScope(
  operation: IOperation,
  scopeID: string | number
) {
  return operation.statusHistory.filter(status => {
    return status.scopeID === scopeID;
  });
}

export interface IOperationFuncOptions {
  resourceID?: string | null;
  scopeID?: string | number;
}

export interface IDispatchOperationFuncProps {
  dispatch: Dispatch;
  operationID: string;
  resourceID?: string | null;
  data?: any;
  scopeID?: string | number;
  error?: OperationError;
}

function dispatchOperationStatus(
  dispatch: Dispatch,
  operationID: string,
  status: IOperationStatus,
  resourceID?: string | null
) {
  dispatch(pushOperation(operationID, status, resourceID));
}

export function dispatchOperationStarted(props: IDispatchOperationFuncProps) {
  const { dispatch, operationID, resourceID, data, scopeID } = props;
  dispatchOperationStatus(
    dispatch,
    operationID,
    {
      data,
      scopeID,
      status: defaultOperationStatusTypes.operationStarted,
      timestamp: Date.now()
    },
    resourceID
  );
}

export function dispatchOperationPending(props: IDispatchOperationFuncProps) {
  const { dispatch, operationID, resourceID, data, scopeID } = props;
  dispatchOperationStatus(
    dispatch,
    operationID,
    {
      data,
      scopeID,
      status: defaultOperationStatusTypes.operationPending,
      timestamp: Date.now()
    },
    resourceID
  );
}

export function dispatchOperationError(props: IDispatchOperationFuncProps) {
  const { dispatch, operationID, resourceID, data, scopeID, error } = props;
  dispatchOperationStatus(
    dispatch,
    operationID,
    {
      data,
      scopeID,
      error,
      status: defaultOperationStatusTypes.operationError,
      timestamp: Date.now()
    },
    resourceID
  );
}

export function dispatchOperationComplete(props: IDispatchOperationFuncProps) {
  const { dispatch, operationID, resourceID, data, scopeID } = props;
  dispatchOperationStatus(
    dispatch,
    operationID,
    {
      data,
      scopeID,
      status: defaultOperationStatusTypes.operationComplete,
      timestamp: Date.now()
    },
    resourceID
  );
}
