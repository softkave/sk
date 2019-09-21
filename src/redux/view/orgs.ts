import { IBlock } from "../../models/block/block";
import IView from "./IView";

export const orgsViewName = "orgs";

export interface IOrgsView extends IView {
  viewName: typeof orgsViewName;
}

export function makeOrgsView(): IOrgsView {
  return {
    viewName: orgsViewName
  };
}

export const currentOrgViewName = "current_org";

export interface ICurrentOrgView extends IView {
  viewName: typeof currentOrgViewName;
  orgID: string;
}

export function makeCurrentOrgView(org: IBlock): ICurrentOrgView {
  return {
    orgID: org.customId,
    viewName: currentOrgViewName
  };
}
