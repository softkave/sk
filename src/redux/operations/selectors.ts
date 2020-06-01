import { IAppState } from "../store";

export function getOperationsWithID(state: IAppState, operationId: string) {
  return state.operations.operations.filter((operation) => {
    return operation.operationId === operationId;
  });
}

export function getFirstOperationWithID(state: IAppState, operationId: string) {
  return state.operations.operations.find((operation) => {
    return operation.operationId === operationId;
  });
}

export function getOperationsForResource(state: IAppState, resourceId: string) {
  return state.operations.operations.filter((operation) => {
    return operation.resourceId === resourceId;
  });
}

export function getOperationWithIdForResource(
  state: IAppState,
  operationId: string,
  resourceId?: string
) {
  return state.operations.operations.find((operation) => {
    return (
      operation.operationId === operationId &&
      operation.resourceId === resourceId
    );
  });
}

export function operationExists(state: IAppState, operationId: string) {
  return !!getOperationsWithID(state, operationId);
}
