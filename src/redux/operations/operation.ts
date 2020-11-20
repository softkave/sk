import { IStoreLikeObject } from "../types";
import OperationActions from "./actions";
import OperationType from "./OperationType";
import OperationSelectors from "./selectors";
import { IOperationActionBaseArgs } from "./types";

export enum OperationStatus {
    Started = "started",
    Pending = "pending",
    Error = "error",
    Completed = "completed",
    Consumed = "consumed",
}

export type OperationStatusScopeId = string | number;
export interface IOperationStatus<T = any, E = any> {
    status: OperationStatus;
    timestamp: number;
    data?: T;
    error?: E;
}

export interface IOperation<T = any, E = any, Meta = any> {
    id: string;
    operationType: OperationType;
    status: IOperationStatus<T, E>;
    meta?: Meta;
    resourceId?: string | null;
}

export function sortOperationsByTimestamp(operations: IOperation[]) {
    return operations.sort((operation1, operation2) => {
        if (operation1.status.timestamp < operation2.status.timestamp) {
            return -1;
        } else if (operation1.status.timestamp > operation2.status.timestamp) {
            return 1;
        } else {
            return 0;
        }
    });
}

export function isOperation(op: any): op is IOperation {
    if (op.id && op.operationType && op.status) {
        return true;
    }

    return false;
}

export function isOperationStarted(operation?: IOperation) {
    return operation?.status.status === OperationStatus.Started;
}

export function isOperationPending(operation?: IOperation) {
    return operation?.status.status === OperationStatus.Pending;
}

export function isOperationStartedOrPending(operation?: IOperation) {
    return isOperationStarted(operation) || isOperationPending(operation);
}

export function isOperationCompleted(operation?: IOperation) {
    return operation?.status.status === OperationStatus.Completed;
}

export function isOperationError(operation?: IOperation) {
    return operation?.status.status === OperationStatus.Error;
}

export function isOperationConsumed(operation?: IOperation) {
    return operation?.status.status === OperationStatus.Consumed;
}

export function dispatchOperationStarted(
    id,
    type,
    resourceId?: string | null,
    data?: any,
    meta?: any
) {
    return OperationActions.pushOperation({
        id,
        resourceId,
        meta,
        operationType: type,
        status: {
            data,
            status: OperationStatus.Started,
            timestamp: Date.now(),
        },
    });
}

export function dispatchOperationCompleted(
    id,
    type,
    resourceId?: string | null,
    data?: any,
    meta?: any
) {
    return OperationActions.pushOperation({
        id,
        resourceId,
        meta,
        operationType: type,
        status: {
            data,
            status: OperationStatus.Completed,
            timestamp: Date.now(),
        },
    });
}

export function dispatchOperationError(
    id,
    type,
    error?: any,
    resourceId?: string | null,
    data?: any,
    meta?: any
) {
    return OperationActions.pushOperation({
        id,
        resourceId,
        meta,
        operationType: type,
        status: {
            data,
            error,
            status: OperationStatus.Error,
            timestamp: Date.now(),
        },
    });
}

export function wrapUpOpAction(
    store: IStoreLikeObject,
    opId: string,
    args: IOperationActionBaseArgs
) {
    const op = OperationSelectors.getOperationWithId(store.getState(), opId);

    if (args.deleteOpOnComplete) {
        store.dispatch(OperationActions.deleteOperation(opId));
    }

    return op;
}
