import { IBlock } from "../../models/block/block";
import { INotification } from "../../models/notification/notification";
import { POP_VIEW, PUSH_VIEW, SET_ROOT_VIEW } from "./constants";
import { makeCurrentNotificationView } from "./notifications";
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

export function setCurrentProject(project: IBlock): IPushViewAction {
  return pushView(makeCurrentProjectView(project));
}

export function setCurrentNotification(
  notification: INotification
): IPushViewAction {
  return pushView(makeCurrentNotificationView(notification));
}

export interface IPopViewAction {
  type: POP_VIEW;
}

export function popView(): IPopViewAction {
  return {
    type: POP_VIEW
  };
}

export interface ISetRootViewAction {
  type: SET_ROOT_VIEW;
  payload: {
    view: IView;
  };
}

export function setRootView(view: IView): ISetRootViewAction {
  return {
    type: SET_ROOT_VIEW,
    payload: {
      view
    }
  };
}

export type IViewAction = IPushViewAction | IPopViewAction | ISetRootViewAction;
