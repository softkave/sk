import { ILogoutUserAction } from "../session/actions";
import { LOGOUT_USER } from "../session/constants";
import { IOperationsAction } from "./actions";
import { CONSUME_OPERATION, PUSH_OPERATION } from "./constants";
import IOperation from "./operation";

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
      return {
        operations: state.operations.concat({
          operationID,
          resourceID,
          statusHistory: [status]
        })
      };
    }

    case CONSUME_OPERATION: {
      const { operationID, resourceID } = action.payload;
      return {
        operations: state.operations.filter(operation => {
          if (resourceID) {
            return (
              operation.operationID === operationID &&
              operation.resourceID === resourceID
            );
          } else {
            return operation.operationID === operationID;
          }
        })
      };
    }

    case LOGOUT_USER: {
      return {};
    }

    default:
      return state;
  }
}
