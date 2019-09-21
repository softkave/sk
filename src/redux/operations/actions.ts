import { DELETE_OPERATION, PUSH_OPERATION } from "./constants";
import { IOperationStatus } from "./operation";

export interface IPushOperationAction {
  type: PUSH_OPERATION;
  payload: {
    operationID: string;
    status: IOperationStatus;
  };
}

export function pushOperation(
  operationID: string,
  status: IOperationStatus
): IPushOperationAction {
  return {
    type: PUSH_OPERATION,
    payload: {
      operationID,
      status
    }
  };
}

export interface IDeleteOperationAction {
  type: DELETE_OPERATION;
  payload: {
    operationID: string;
  };
}

export function deleteOperation(operationID: string): IDeleteOperationAction {
  return {
    type: DELETE_OPERATION,
    payload: {
      operationID
    }
  };
}

export type IOperationsAction = IPushOperationAction | IDeleteOperationAction;
