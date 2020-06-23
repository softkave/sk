import isFunction from "lodash/isFunction";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import OperationActions from "../../redux/operations/actions";
import IOperation, {
  IOperationStatus,
  isOperationCompleted,
  isOperationStartedOrPending,
} from "../../redux/operations/operation";
import OperationSelectors from "../../redux/operations/selectors";
import { IAppState } from "../../redux/store";
import { newId } from "../../utils/utils";

export interface IUseOperationStatus {
  isLoading: boolean;
  isError: boolean;
  isCompleted: boolean;
  id: string;
  error?: any;
  operation?: IOperation;
  status?: IOperationStatus;
}

export interface IOperationSelector {
  id?: string;
}

type LoadOperation = (statusData: IUseOperationStatus) => void;
type UseOperation = (
  selector?: IOperationSelector,
  loadOperation?: LoadOperation | false | null
) => IUseOperationStatus;

export const getOperationStats = (
  operation: IOperation | undefined,
  id: string
): IUseOperationStatus => {
  const isLoading = isOperationStartedOrPending(operation);
  const isCompleted = isOperationCompleted(operation);
  const error = operation?.status.error;

  return {
    isLoading,
    isCompleted,
    error,
    operation,
    id,
    isError: !!error,
    status: operation?.status,
  };
};

const useOperation: UseOperation = (selector = {}, loadOperation) => {
  const dispatch = useDispatch();
  const [managedOpId] = React.useState(() => {
    if (selector.id) {
      return null;
    }

    return newId();
  });

  const operation = useSelector<IAppState, IOperation | undefined>((state) =>
    OperationSelectors.getOperationWithId(state, selector.id || managedOpId)
  );

  const statusData = getOperationStats(operation, selector.id || managedOpId);

  React.useEffect(() => {
    if (isFunction(loadOperation)) {
      loadOperation(statusData);
    }
  }, [statusData, loadOperation]);

  React.useEffect(() => {
    return () => {
      if (managedOpId) {
        dispatch(OperationActions.deleteOperation(managedOpId));
      }
    };
  }, [managedOpId]);

  return statusData;
};

export default useOperation;
