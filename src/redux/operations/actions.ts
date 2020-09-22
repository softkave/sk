import { createAction } from "@reduxjs/toolkit";
import { IOperation, IOperationStatus } from "./operation";
import OperationType from "./OperationType";

export interface IPushOperationProps {
    operationType: OperationType;
    status: IOperationStatus;
    id: string;
    meta?: any;
    resourceId?: string | null;
}

const pushOperation = createAction<IPushOperationProps>(
    "operations/pushOperation"
);

const bulkAddOperations = createAction<IOperation[]>(
    "operations/bulkAddOperations"
);

const deleteOperation = createAction<string>("operations/deleteOperation");

export default class OperationActions {
    public static pushOperation = pushOperation;
    public static deleteOperation = deleteOperation;
    public static bulkAddOperations = bulkAddOperations;
}
