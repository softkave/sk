import { ILogoutUserAction } from "../session/actions";
import { LOGOUT_USER } from "../session/constants";
import { IOperationsAction } from "./actions";
import { PUSH_OPERATION } from "./constants";
import IOperation from "./operation";

function isOperation(
  operation: IOperation,
  operationId: string,
  resourceId?: string | null
) {
  if (resourceId) {
    return (
      operation.operationId === operationId &&
      operation.resourceId === resourceId
    );
  } else {
    return operation.operationId === operationId;
  }
}

export interface IOperationState {
  operations: IOperation[];
}

export default function operationsReducer(
  state: IOperationState = { operations: [] },
  action: IOperationsAction | ILogoutUserAction
) {
  switch (action.type) {
    case PUSH_OPERATION: {
      const { operationId, resourceId, status } = action.payload;
      const existingOperationIndex = state.operations.findIndex((operation) => {
        return isOperation(operation, operationId, resourceId);
      });

      if (existingOperationIndex === -1) {
        return {
          operations: state.operations.concat({
            operationId,
            resourceId,
            statusHistory: [status],
          }),
        };
      } else {
        const operations = [...state.operations];
        const operation = operations[existingOperationIndex];
        operations[existingOperationIndex] = {
          ...operation,
          statusHistory: [...operation.statusHistory, status],
        };

        return { operations };
      }
    }

    case LOGOUT_USER: {
      return { operations: [] };
    }

    default:
      return state;
  }
}
