import { PUSH_OPERATION } from "./constants";
import { IOperationStatus } from "./operation";

export interface IPushOperationAction {
  type: PUSH_OPERATION;
  payload: {
    operationId: string;
    status: IOperationStatus;
    resourceId?: string | null;
  };
}

export function pushOperation(
  operationId: string,
  status: IOperationStatus,
  resourceId?: string | null
): IPushOperationAction {
  return {
    type: PUSH_OPERATION,
    payload: {
      operationId,
      status,
      resourceId,
    },
  };
}

export type IOperationsAction = IPushOperationAction;
