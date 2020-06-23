import { IAppState } from "../types";

const getOperationWithId = (state: IAppState, id: string) =>
  state.operations[id];

export default class OperationSelectors {
  public static getOperationWithId = getOperationWithId;
}
