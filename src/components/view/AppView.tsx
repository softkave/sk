import React from "react";

import NotificationsContainer from "../../app/notification";
import OrgsContainer from "../../app/orgs";
import {
  currentNotificationViewName,
  notificationsViewName
} from "../../redux/view/notifications";
import {
  currentOrgViewName,
  makeOrgsView,
  orgsViewName
} from "../../redux/view/orgs";
import { currentProjectViewName } from "../../redux/view/project";
import IView from "../../redux/view/view";
import OrgContainer from "../org/OrgContainer";
import ProjectContainer from "../project/ProjectContainer";
import ViewManager, { IRenderView } from "./ViewManager";

export interface IAppViewProps {
  currentView: IView;
}

class AppView extends React.Component<IAppViewProps> {
  public static defaultProps = {
    currentView: makeOrgsView()
  };

  public render() {
    const { currentView } = this.props;
    const renderViews: IRenderView[] = [
      { viewName: orgsViewName, component: OrgsContainer },
      { viewName: currentOrgViewName, component: OrgContainer },
      { viewName: notificationsViewName, component: NotificationsContainer },
      {
        viewName: currentNotificationViewName,
        component: NotificationsContainer
      },
      { viewName: currentProjectViewName, component: ProjectContainer }
    ];

    return (
      <ViewManager views={renderViews} currentViewName={currentView.viewName} />
    );
  }
}

export default AppView;
