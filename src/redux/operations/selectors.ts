import { IAppState } from "../types";
import { IOperation } from "./operation";

const getOperationWithId = (state: IAppState, id: string) =>
  state.operations[id];

export interface IQueryFilterOperationSelector {
  id?: string;
  resourceId?: string;
  type?: string;
  filter?: (operation: IOperation) => boolean;
}

const queryFilterOperation = (
  state: IAppState,
  selector: IQueryFilterOperationSelector
) => {
  if (Object.keys(selector).length === 0) {
    return;
  }

  const ids = Object.keys(state.operations);

  // tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < ids.length; i++) {
    const op = state.operations[ids[i]];

    if (selector.filter && selector.filter(op)) {
      return op;
    } else if (selector.id && selector.id === op.id) {
      return op;
    } else if (selector.resourceId && selector.resourceId === op.resourceId) {
      return op;
    } else if (selector.type && selector.type === op.operationType) {
      return op;
    }
  }
};

export default class OperationSelectors {
  public static getOperationWithId = getOperationWithId;
  public static queryFilterOperation = queryFilterOperation;
}
