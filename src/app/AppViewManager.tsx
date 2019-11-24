import React from "react";
import AssignedTasksContainer from "../components/assigned-tasks/AssignedTasksContainer";
import NotificationsContainer from "../components/notification/NotificationsContainer";
import OrgsContainer from "../components/organizations/OrgsContainer";
import ViewManager, { IRenderView } from "../components/view/ViewManager";
import { assignedTasksViewName } from "../redux/view/assignedTasks";
import {
  currentNotificationViewName,
  notificationsViewName
} from "../redux/view/notifications";
import { currentOrgViewName, orgsViewName } from "../redux/view/orgs";
import { currentProjectViewName } from "../redux/view/project";
import IView from "../redux/view/view";

export interface IAppViewManagerProps {
  currentView: IView;
}

class AppViewManager extends React.Component<IAppViewManagerProps> {
  public render() {
    const { currentView } = this.props;
    const renderViews: IRenderView[] = [
      { viewName: orgsViewName, component: OrgsContainer },
      { viewName: currentOrgViewName, component: OrgsContainer },
      { viewName: notificationsViewName, component: NotificationsContainer },
      {
        viewName: currentNotificationViewName,
        component: NotificationsContainer
      },
      // TODO: Split functionality, single responsibility principle
      { viewName: currentProjectViewName, component: OrgsContainer },
      { viewName: assignedTasksViewName, component: AssignedTasksContainer }
    ];

    return (
      <ViewManager views={renderViews} currentViewName={currentView.viewName} />
    );
  }
}

export default AppViewManager;
