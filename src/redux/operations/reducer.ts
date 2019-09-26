import { ILogoutUserAction } from "../session/actions";
import { LOGOUT_USER } from "../session/constants";
import { IOperationsAction } from "./actions";
import IOperation from "./operation";

export interface IOperationState {
  operations: IOperation[];
}

export default function operationsReducer(
  state: IOperationState = { operations: [] },
  action: IOperationsAction | ILogoutUserAction
) {
  switch (action.type) {
    case LOGOUT_USER: {
      return {};
    }

    default:
      return state;
  }
}
