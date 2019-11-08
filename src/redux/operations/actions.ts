import { PUSH_OPERATION } from "./constants";
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

export type IOperationsAction = IPushOperationAction;
