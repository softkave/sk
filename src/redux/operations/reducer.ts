import { IOperationsAction } from "./actions";
import IOperation from "./operation";

export interface IOperationState {
  operations: IOperation[];
}

export default function operationsReducer(
  state: IOperationState = { operations: [] },
  action: IOperationsAction
) {
  switch (action.type) {
    default:
      return state;
  }
}
