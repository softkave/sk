import { IBlock } from "../../models/block/block";
import IView from "./view";

export const currentProjectViewName = "current_project";

export interface IViewCurrentProject extends IView {
  viewName: typeof currentProjectViewName;
  parentBlockID: string;
  projectID: string;
}

export function makeCurrentProjectView(project: IBlock): IViewCurrentProject {
  return {
    viewName: currentProjectViewName,
    parentBlockID: project.parents[project.parents.length - 1],
    projectID: project.customId
  };
}
