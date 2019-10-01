import { IBlock } from "../../models/block/block";
import {
  CLEAR_VIEWS_FROM,
  POP_VIEW,
  PUSH_VIEW,
  REPLACE_VIEW
} from "./constants";
import { makeCurrentOrgView } from "./orgs";
import { makeCurrentProjectView } from "./project";
import IView from "./view";

export interface IPushViewAction {
  type: PUSH_VIEW;
  payload: {
    view: IView;
  };
}

export function pushView(view: IView): IPushViewAction {
  console.log({ view });
  return {
    type: PUSH_VIEW,
    payload: {
      view
    }
  };
}

export function setCurrentOrg(org: IBlock): IPushViewAction {
  console.log({ org });
  return pushView(makeCurrentOrgView(org));
}

export function setCurrentProject(project: IBlock): IPushViewAction {
  return pushView(makeCurrentProjectView(project));
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
    view: IView;
  };
}

export function replaceView(viewName: string, view: IView): IReplaceViewAction {
  return {
    type: REPLACE_VIEW,
    payload: {
      viewName,
      view
    }
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
  | IReplaceViewAction
  | IClearViewsFromAction;
