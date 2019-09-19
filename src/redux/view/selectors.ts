import { getBlock } from "../blocks/selectors";
import { IReduxState } from "../store";

export function getCurrentOrgID(state: IReduxState) {
  const currentOrgID = state.view.currentOrgID;
  return currentOrgID;
}

export function getCurrentOrg(state: IReduxState) {
  const currentOrgID = getCurrentOrgID(state);

  if (currentOrgID) {
    return getBlock(state, currentOrgID);
  }
}
