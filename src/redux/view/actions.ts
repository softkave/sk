import { SET_CURRENT_ORG } from "./constants";

export interface ISetCurrentOrgAction {
  type: SET_CURRENT_ORG;
  payload: {
    orgID: string;
  };
}

export function setCurrentOrg(orgID): ISetCurrentOrgAction {
  return {
    type: SET_CURRENT_ORG,
    payload: {
      orgID
    }
  };
}

export type IViewAction = ISetCurrentOrgAction;
