import { IBlock } from "../../models/block/block";
import { getBlock } from "../blocks/selectors";
import { IReduxState } from "../store";
import { currentOrgViewName, ICurrentOrgView } from "./orgs";
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

export function getRootView(state: IReduxState): IView {
  return state.view.viewHistory[0];
}
