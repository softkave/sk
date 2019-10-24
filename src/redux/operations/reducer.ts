import { ILogoutUserAction } from "../session/actions";
import { LOGOUT_USER } from "../session/constants";
import { IOperationsAction } from "./actions";
import { CONSUME_OPERATION, PUSH_OPERATION } from "./constants";
import IOperation from "./operation";

function isOperation(
  operation: IOperation,
  operationID: string,
  resourceID?: string | null
) {
  if (resourceID) {
    return (
      operation.operationID === operationID &&
      operation.resourceID === resourceID
    );
  } else {
    return operation.operationID === operationID;
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
      const { operationID, resourceID, status } = action.payload;
      const existingOperationIndex = state.operations.findIndex(operation => {
        return isOperation(operation, operationID, resourceID);
      });

      if (existingOperationIndex === -1) {
        return {
          operations: state.operations.concat({
            operationID,
            resourceID,
            statusHistory: [status]
          })
        };
      } else {
        const operations = [...state.operations];
        const operation = operations[existingOperationIndex];
        operations[existingOperationIndex] = {
          ...operation,
          statusHistory: [...operation.statusHistory, status]
        };

        return { operations };
      }
    }

    case CONSUME_OPERATION: {
      const { operationID, resourceID } = action.payload;
      return {
        operations: state.operations.filter(operation => {
          return isOperation(operation, operationID, resourceID);
        })
      };
    }

    case LOGOUT_USER: {
      return { operations: [] };
    }

    default:
      return state;
  }
}
