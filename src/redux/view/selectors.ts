import { IBlock } from "../../models/block/block";
import { getBlock } from "../blocks/selectors";
import { getNotification } from "../notifications/selectors";
import { IReduxState } from "../store";
import {
  currentNotificationViewName,
  ICurrentNotificationView
} from "./notifications";
import { currentOrgViewName, ICurrentOrgView } from "./orgs";
import { currentProjectViewName, ICurrentProjectView } from "./project";
import IView from "./view";

export function getCurrentView(state: IReduxState): IView | undefined {
  const viewHistory = state.view.viewHistory;

  return viewHistory[viewHistory.length - 1];
}

export function getView<ViewType extends IView = IView>(
  state: IReduxState,
  viewName: string
): ViewType | undefined {
  return state.view.viewHistory.find(view => {
    return view.viewName === viewName;
  }) as ViewType;
}

export function getCurrentOrg(state: IReduxState): IBlock | undefined {
  const currentOrgView = getView<ICurrentOrgView>(state, currentOrgViewName);

  if (currentOrgView) {
    return getBlock(state, currentOrgView.orgID);
  }
}

export function getCurrentProject(state: IReduxState) {
  const currentProjectView = getView<ICurrentProjectView>(
    state,
    currentProjectViewName
  );

  if (currentProjectView) {
    const block = getBlock(state, currentProjectView.projectID);

    if (!block) {
      throw new Error("Runtime error");
    }

    return block;
  }
}

export function getCurrentNotification(state: IReduxState) {
  const currentNotificationView = getView<ICurrentNotificationView>(
    state,
    currentNotificationViewName
  );

  if (currentNotificationView) {
    const notification = getNotification(
      state,
      currentNotificationView.notificationID
    );

    if (!notification) {
      throw new Error("Runtime error");
    }

    return notification;
  }
}

export function getRootView(state: IReduxState): IView {
  return state.view.viewHistory[0];
}
