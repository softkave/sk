import isFunction from "lodash/isFunction";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import OperationActions from "../../redux/operations/actions";
import {
  IOperation,
  IOperationStatus,
  isOperationCompleted,
  isOperationStartedOrPending,
} from "../../redux/operations/operation";
import OperationSelectors, {
  IQueryFilterOperationSelector,
} from "../../redux/operations/selectors";
import { IAppState } from "../../redux/types";
import { newId } from "../../utils/utils";

export interface IUseOperationStatus {
  isLoading: boolean;
  isError: boolean;
  isCompleted: boolean;
  opId: string;
  error?: any;
  operation?: IOperation;
  status?: IOperationStatus;
}

type LoadOperation = (statusData: IUseOperationStatus) => void;

interface IUseOperationOptions {
  deleteManagedOperationOnUnmount?: boolean;
}

type UseOperation = (
  selector?: IQueryFilterOperationSelector,
  loadOperation?: LoadOperation | false | null,
  options?: IUseOperationOptions
) => IUseOperationStatus;

export const getOperationStats = (
  operation: IOperation
): IUseOperationStatus => {
  const isLoading = isOperationStartedOrPending(operation);
  const isCompleted = isOperationCompleted(operation);
  const error = operation.status.error;

  return {
    isLoading,
    isCompleted,
    error,
    operation,
    opId: operation.id,
    isError: !!error,
    status: operation?.status,
  };
};

const useOperation: UseOperation = (
  selector = {},
  loadOperation = null,
  options = { deleteManagedOperationOnUnmount: true }
) => {
  const dispatch = useDispatch();
  const operation = useSelector<IAppState, IOperation | undefined>((state) => {
    // TODO: how can we cache previous filters
    return OperationSelectors.queryFilterOperation(state, selector);
  });
  const [managedOpId] = React.useState(() => {
    if (!operation && !selector.id) {
      return newId();
    }
  });

  const statusData: IUseOperationStatus = operation
    ? getOperationStats(operation)
    : {
        isCompleted: false,
        isError: false,
        isLoading: false,
        opId: selector.id || managedOpId,
      };

  React.useEffect(() => {
    if (isFunction(loadOperation)) {
      loadOperation(statusData);
    }
  }, [statusData, loadOperation]);

  React.useEffect(() => {
    return () => {
      if (operation && managedOpId && options.deleteManagedOperationOnUnmount) {
        console.log("deleting here - useOperation", {
          managedOpId,
          selector,
          operation,
        });
        // throw new Error("P");
        dispatch(OperationActions.deleteOperation(managedOpId));
      }
    };
  }, [managedOpId, dispatch, options.deleteManagedOperationOnUnmount]);

  return statusData;
};

export default useOperation;
