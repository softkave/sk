import IView from "./view";

export const assignedTasksViewName = "assignedTasks";

export interface IAssignedTasksView extends IView {
  viewName: typeof assignedTasksViewName;
}

export function makeAssignedTasksView(): IAssignedTasksView {
  return {
    viewName: assignedTasksViewName
  };
}
