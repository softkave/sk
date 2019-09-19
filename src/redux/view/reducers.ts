import { IViewAction } from "./actions";
import { SET_CURRENT_ORG } from "./constants";

export interface IViewState {
  currentOrgID?: string;
}

export default function viewReducer(
  state: IViewState = {},
  action: IViewAction
) {
  switch (action.type) {
    case SET_CURRENT_ORG: {
      return {
        ...state,
        currentOrgID: action.payload.orgID
      };
    }

    default:
      return state;
  }
}
