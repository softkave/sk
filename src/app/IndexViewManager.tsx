import { notification } from "antd";
import React from "react";
import { Redirect } from "react-router-dom";
import Loading from "../components/Loading";
import ViewManager, { IRenderView } from "../components/view/ViewManager";
import {
  sessionApp,
  sessionInitializing,
  sessionWeb
} from "../redux/session/reducer";
import IView from "../redux/view/view";
import AppContainer from "./AppContainer";
import Routes from "./Routes";

export interface IIndexViewManagerProps {
  view: IView;
  initializingProps?: {
    progress: number;
  };
  readyProps?: {
    // TODO: define the right error type
    error?: any;
  };
}

class IndexViewManager extends React.Component<IIndexViewManagerProps> {
  public render() {
    const { readyProps, view: currentView } = this.props;

    const shouldNavigateToHome = this.shouldNavigateToHome();

    const renderViews: IRenderView[] = [
      {
        // TODO: Test this view
        viewName: sessionInitializing,
        render() {
          return <Loading />;
        }
      },
      {
        viewName: sessionWeb,
        render() {
          if (readyProps && readyProps.error) {
            // TODO: use error messages
            notification.error({
              message: "Error",
              description: "Login failed",
              duration: 5 * 1000
            });
          }

          return <Routes />;
        }
      },
      {
        viewName: sessionApp,
        render() {
          return (
            <React.Fragment>
              {shouldNavigateToHome && <Redirect to="/" />}
              <AppContainer />
            </React.Fragment>
          );
        }
      }
    ];

    return (
      <ViewManager views={renderViews} currentViewName={currentView.viewName} />
    );
  }

  private shouldNavigateToHome() {
    return window.location.pathname !== "/";
  }
}

export default IndexViewManager;
