import { createAction } from "@reduxjs/toolkit";
import { IOperationStatus } from "./operation";
import OperationType from "./OperationType";

export interface IPushOperationProps {
  operationType: OperationType;
  status: IOperationStatus;
  id: string;
  resourceId?: string | null;
}

const pushOperation = createAction<IPushOperationProps>(
  "operations/pushOperation"
);

const deleteOperation = createAction<string>("operations/deleteOperation");

export default class OperationActions {
  public static pushOperation = pushOperation;
  public static deleteOperation = deleteOperation;
}
