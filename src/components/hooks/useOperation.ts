import isFunction from "lodash/isFunction";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { INetError } from "../../net/types";
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
import { getNewId } from "../../utils/utils";

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

export interface IMergedOperationStats {
    loading?: boolean;
    errors?: INetError | INetError[];
}

export function mergeOperationStats(
    opStats: IUseOperationStatus[]
): IMergedOperationStats {
    for (const opStat of opStats) {
        if (!opStat.operation || opStat.isLoading) {
            return { loading: true };
        }

        // Only returning the first error found
        if (opStat.error) {
            return { errors: opStat.error };
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
    const operation = useSelector<IAppState, IOperation | undefined>(
        (state) => {
            // TODO: how can we cache previous filters

            if (isSelectorEmpty) {
                return OperationSelectors.getOperationWithId(
                    state,
                    spareIdStore.id
                );
            }

            return OperationSelectors.queryFilterOperation(state, selector);
        }
    );

    const statusData: IUseOperationStatus = operation
        ? getOperationStats(operation)
        : {
              isCompleted: false,
              isError: false,
              isLoading: false,
              opId: selector.id || spareIdStore.id,
          };

    React.useEffect(() => {
        if (isSelectorEmpty) {
            setSpareIdData({ id: spareIdStore.id, isUsingSpareId: true });
        }
    }, [isSelectorEmpty, spareIdStore.id]);

    React.useEffect(() => {
        if (isFunction(loadOperation)) {
            loadOperation(statusData);
        }
    }, [statusData, loadOperation]);

    React.useEffect(() => {
        return () => {
            if (
                // operation &&
                spareIdStore.isUsingSpareId &&
                options.deleteManagedOperationOnUnmount
            ) {
                dispatch(OperationActions.deleteOperation(spareIdStore.id));
            }
        };
    }, [
        spareIdStore,
        dispatch,
        options.deleteManagedOperationOnUnmount,
        // operation,
    ]);

    return statusData;
};

export default useOperation;
