import { IBlock } from "../../models/block/block";
import { CLEAR_VIEWS_FROM, POP_VIEW, PUSH_VIEW } from "./constants";
import IView from "./IView";
import { makeCurrentOrgView } from "./orgs";

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

export interface IClearViewsFromAction {
  type: CLEAR_VIEWS_FROM;
  payload: {
    viewName: string;
  };
}

export function clearViewsFrom(viewName: string): IClearViewsFromAction {
  return {
    type: CLEAR_VIEWS_FROM,
    payload: {
      viewName
    }
  };
}

export type IViewAction =
  | IPushViewAction
  | IPopViewAction
  | IClearViewsFromAction;
