import { IBlock } from "../../models/block/block";
import { POP_VIEW, PUSH_VIEW, REPLACE_VIEW } from "./constants";
import { makeCurrentOrgView } from "./orgs";
import IView from "./view";

export interface IPushViewAction {
  type: PUSH_VIEW;
  payload: {
    view: IView;
  };
}

export function pushView(view: IView): IPushViewAction {
  return {
    type: PUSH_VIEW,
    payload: {
      view
    }
  };
}

export function setCurrentOrg(org: IBlock): IPushViewAction {
  return pushView(makeCurrentOrgView(org));
}

export interface IPopViewAction {
  type: POP_VIEW;
}

export function popView(): IPopViewAction {
  return {
    type: POP_VIEW
  };
}

export interface IReplaceViewAction {
  type: REPLACE_VIEW;
  payload: {
    viewName: string;
    newViewName: string;
  };
}

export function replaceView(
  viewName: string,
  newViewName: string
): IReplaceViewAction {
  return {
    type: REPLACE_VIEW,
    payload: {
      viewName,
      newViewName
    }
  };
}

export type IViewAction = IPushViewAction | IPopViewAction | IReplaceViewAction;
