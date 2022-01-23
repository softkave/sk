import isFunction from "lodash/isFunction";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IAppError } from "../../net/types";
import OperationActions from "../../redux/operations/actions";
import {
  IOperation,
  IOperationStatus,
  isOperationCompleted,
  isOperationError,
  isOperationStartedOrPending,
} from "../../redux/operations/operation";
import OperationSelectors, {
  IQueryFilterOperationSelector,
} from "../../redux/operations/selectors";
import { IAppState } from "../../redux/types";
import { getNewId } from "../../utils/utils";

export interface IOperationDerivedData {
  isLoading: boolean;
  isError: boolean;
  isCompleted: boolean;
  opId: string;
  error?: any;
  operation?: IOperation;
  status?: IOperationStatus;
}

type LoadOperation = (opData: IOperationDerivedData) => void;

interface IUseOperationOptions {
  deleteManagedOperationOnUnmount?: boolean;
  waitFor?: Array<
    IQueryFilterOperationSelector | IOperation | null | undefined
  >;
  handleWaitForError?: () => boolean; // True to cancel the op load, false to fetch
}

type UseOperation = (
  selector?: IQueryFilterOperationSelector,
  loadOperation?: LoadOperation | false | null,
  options?: IUseOperationOptions
) => IOperationDerivedData;

export const getOpData = (operation: IOperation): IOperationDerivedData => {
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

export interface IMergedOperationStats {
  loading?: boolean;
  errors?: IAppError | IAppError[];
}

export function mergeOps(ops: IOperationDerivedData[]): IMergedOperationStats {
  for (const op of ops) {
    if (op.isCompleted) {
      continue;
    }

    if (!op.operation || op.isLoading) {
      return { loading: true };
    }

    // TODO: Only returning the first error found
    if (op.error) {
      return { errors: op.error };
    }
  }

  return {};
}

interface ISpareIdStore {
  id: string;
  isUsingSpareId?: boolean;
}

const useOperation: UseOperation = (
  selector = {},
  loadOperation = null,
  options = { deleteManagedOperationOnUnmount: true }
) => {
  const dispatch = useDispatch();
  const [spareIdStore, setSpareIdData] = React.useState<ISpareIdStore>({
    id: getNewId(),
  });

  const isSelectorEmpty = Object.keys(selector).length === 0;
  const operation = useSelector<IAppState, IOperation | undefined>((state) => {
    // TODO: how can we cache previous filters
    if (isSelectorEmpty) {
      return OperationSelectors.getOperationWithId(state, spareIdStore.id);
    }

    return OperationSelectors.queryFilterOperation(state, selector);
  });

  const shouldWait = useSelector<IAppState, boolean>((state) => {
    if (operation) {
      return false;
    }

    if (
      !options.waitFor ||
      options.waitFor.length === 0 ||
      !options.handleWaitForError
    ) {
      return false;
    }

    const waitForOperations = OperationSelectors.queryFilterOperations(
      state,
      options.waitFor
    );

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < waitForOperations.length; i++) {
      const op = waitForOperations[i];

      if (!op) {
        return true;
      }

      if (isOperationError(op)) {
        return options.handleWaitForError();
      }

      if (!isOperationCompleted(op)) {
        return true;
      }
    }

    return false;
  });

  const statusData: IOperationDerivedData = React.useMemo(() => {
    const data = operation
      ? getOpData(operation)
      : {
          isCompleted: false,
          isError: false,
          isLoading: false,
          opId: selector.id || spareIdStore.id,
        };

    return data;
  }, [operation, selector.id, spareIdStore.id]);

  React.useEffect(() => {
    if (isSelectorEmpty) {
      setSpareIdData({ id: spareIdStore.id, isUsingSpareId: true });
    }
  }, [isSelectorEmpty, spareIdStore.id]);

  React.useEffect(() => {
    if (isFunction(loadOperation) && !shouldWait) {
      loadOperation(statusData);
    }
  }, [statusData, loadOperation, shouldWait]);

  React.useEffect(() => {
    return () => {
      if (
        spareIdStore.isUsingSpareId &&
        options.deleteManagedOperationOnUnmount
      ) {
        dispatch(OperationActions.deleteOperation(spareIdStore.id));
      }
    };
  }, [spareIdStore, dispatch, options.deleteManagedOperationOnUnmount]);

  return statusData;
};

export default useOperation;
