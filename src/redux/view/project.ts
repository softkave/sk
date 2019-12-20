import { IBlock } from "../../models/block/block";
import { getBlockParentIDs } from "../../models/block/utils";
import IView from "./view";

export const currentProjectViewName = "current_project";

export interface ICurrentProjectView extends IView {
  viewName: typeof currentProjectViewName;
  parentBlockID: string;
  projectID: string;
}

export function makeCurrentProjectView(project: IBlock): ICurrentProjectView {
  const projectParentIDs = getBlockParentIDs(project);
  return {
    viewName: currentProjectViewName,
    parentBlockID: projectParentIDs[projectParentIDs.length - 1],
    projectID: project.customId
  };
}
