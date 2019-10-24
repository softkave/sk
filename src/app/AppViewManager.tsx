import React from "react";
import NotificationsContainer from "../components/notification/NotificationsContainer";
import OrgsContainer from "../components/org/OrgsContainer";
import ViewManager, { IRenderView } from "../components/view/ViewManager";
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
    console.log(this.props);
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
      { viewName: currentProjectViewName, component: OrgsContainer }
    ];

    return (
      <ViewManager views={renderViews} currentViewName={currentView.viewName} />
    );
  }
}

export default AppViewManager;
