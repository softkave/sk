import isFunction from "lodash/isFunction";
import React from "react";
import { useSelector } from "react-redux";
import IOperation, {
  IOperationStatus,
  isOperationCompleted,
  isOperationStartedOrPending,
} from "../../redux/operations/operation";
import {
  getFirstOperationWithId,
  getOperationWithIdForResource,
} from "../../redux/operations/selectors";
import { IAppState } from "../../redux/store";

export interface IUseOperationStatus {
  isLoading: boolean;
  isError: boolean;
  isCompleted: boolean;
  error?: any;
  operation?: IOperation;
  status?: IOperationStatus;
}

export interface IOperationSelector {
  operationId: string;
  resourceId?: string;
}

type LoadOperation = (statusData: IUseOperationStatus) => void;
type UseOperation = (
  selector: IOperationSelector,
  loadOperation?: LoadOperation | false | null
) => IUseOperationStatus;

export const getOperationDetailedStatus = (
  operation: IOperation | undefined
): IUseOperationStatus => {
  const isLoading = isOperationStartedOrPending(operation);
  const isCompleted = isOperationCompleted(operation);
  const error = operation?.status.error;

  return {
    isLoading,
    isCompleted,
    error,
    operation,
    isError: !!error,
    status: operation?.status,
  };
};

const getOperation = (state: IAppState, selector: IOperationSelector) => {
  return selector.resourceId
    ? getOperationWithIdForResource(
        state,
        selector.operationId,
        selector.resourceId
      )
    : getFirstOperationWithId(state, selector.operationId);
};

const useOperation: UseOperation = (selector, loadOperation) => {
  const operation = useSelector<IAppState, IOperation | undefined>((state) =>
    getOperation(state, selector)
  );
  const statusData = getOperationDetailedStatus(operation);

  React.useEffect(() => {
    if (isFunction(loadOperation)) {
      loadOperation(statusData);
    }
  }, [statusData, loadOperation]);

  return statusData;
};

export default useOperation;
