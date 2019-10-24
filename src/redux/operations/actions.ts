import { CONSUME_OPERATION, PUSH_OPERATION } from "./constants";
import { IOperationStatus } from "./operation";

export interface IPushOperationAction {
  type: PUSH_OPERATION;
  payload: {
    operationID: string;
    status: IOperationStatus;
    resourceID?: string | null;
  };
}

export function pushOperation(
  operationID: string,
  status: IOperationStatus,
  resourceID?: string | null
): IPushOperationAction {
  return {
    type: PUSH_OPERATION,
    payload: {
      operationID,
      status,
      resourceID
    }
  };
}

export interface IConsumeOperationAction {
  type: CONSUME_OPERATION;
  payload: {
    operationID: string;
    resourceID?: string | null;
  };
}

export function consumeOperation(
  operationID: string,
  resourceID?: string | null
): IConsumeOperationAction {
  return {
    type: CONSUME_OPERATION,
    payload: {
      operationID,
      resourceID
    }
  };
}

export type IOperationsAction = IPushOperationAction | IConsumeOperationAction;
