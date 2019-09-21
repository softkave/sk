import { CLEAR_STATE } from "./constants";

export interface IClearStateAction {
  type: CLEAR_STATE;
}

export function clearState() {
  return { type: CLEAR_STATE };
}
