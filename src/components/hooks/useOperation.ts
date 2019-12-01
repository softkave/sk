import isFunction from "lodash/isFunction";
import React from "react";
import { useSelector } from "react-redux";
import IOperation, {
  getOperationLastError,
  getOperationLastStatus,
  IOperationStatus,
  isOperationCompleted,
  isOperationStartedOrPending
} from "../../redux/operations/operation";
import {
  getFirstOperationWithID,
  getOperationWithIDForResource
} from "../../redux/operations/selectors";
import { IReduxState } from "../../redux/store";

export interface IUseOperationStatus {
  isLoading: boolean;
  isError: boolean;
  isCompleted: boolean;
  error?: any;
  operation?: IOperation;
  currentStatus?: IOperationStatus;
}

export interface IOperationSelector {
  operationID: string;
  resourceID?: string;
  scopeID?: string;
}

type LoadOperation = (statusData: IUseOperationStatus) => void;
type UseOperation = (
  selector: IOperationSelector,
  loadOperation?: LoadOperation
) => IUseOperationStatus;

const getOperationStatus = (
  operation: IOperation | undefined,
  selector: IOperationSelector
): IUseOperationStatus => {
  const isLoading = isOperationStartedOrPending(operation, selector.scopeID);
  const isCompleted = isOperationCompleted(operation, selector.scopeID);
  const status = getOperationLastStatus(operation, selector.scopeID);
  const error = getOperationLastError(operation, selector.scopeID);

  return {
    isLoading,
    isCompleted,
    error,
    operation,
    isError: !!error,
    currentStatus: status
  };
};

const getOperation = (state: IReduxState, selector: IOperationSelector) => {
  return selector.resourceID
    ? getOperationWithIDForResource(
        state,
        selector.operationID,
        selector.resourceID
      )
    : getFirstOperationWithID(state, selector.operationID);
};

const useOperation: UseOperation = (selector, loadOperation) => {
  const operation = useSelector<IReduxState, IOperation | undefined>(state =>
    getOperation(state, selector)
  );
  const statusData = getOperationStatus(operation, selector);

  React.useEffect(() => {
    if (isFunction(loadOperation)) {
      loadOperation(statusData);
    }
  }, [statusData]);

  return statusData;
};

export default useOperation;
