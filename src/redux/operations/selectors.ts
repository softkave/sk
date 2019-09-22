import { IReduxState } from "../store";

export function getOperationsWithID(state: IReduxState, operationID: string) {
  return state.operations.operations.filter(operation => {
    return operation.operationID === operationID;
  });
}

export function getOperationsForResource(
  state: IReduxState,
  resourceID: string
) {
  return state.operations.operations.filter(operation => {
    return operation.resourceID === resourceID;
  });
}

export function getOperationWithIDForResource(
  state: IReduxState,
  operationID: string,
  resourceID?: string
) {
  return state.operations.operations.find(operation => {
    return (
      operation.operationID === operationID &&
      operation.resourceID === resourceID
    );
  });
}

export function operationExists(state: IReduxState, operationID: string) {
  return !!getOperationsWithID(state, operationID);
}
