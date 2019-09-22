import React from "react";

import IView from "../../redux/view/view";
import NotFoundView from "./NotFoundView";

export interface IRenderView extends IView {
  component?: React.ComponentClass | React.SFC;
  renderedComponent?: React.ReactElement;
  render?: (props?: any) => React.ReactNode;
}

export interface IViewManagerProps {
  views: IRenderView[];
  currentViewName: string;
  viewRenderProps?: any;
}

export default class ViewManager extends React.Component<IViewManagerProps> {
  public render() {
    const { views, currentViewName, viewRenderProps } = this.props;
    const currentView = views.find(view => {
      return view.viewName === currentViewName;
    });

    if (currentView) {
      if (currentView.render) {
        return currentView.render(viewRenderProps);
      } else if (currentView.renderedComponent) {
        return React.cloneElement(
          currentView.renderedComponent,
          viewRenderProps
        );
      } else if (currentView.component) {
        return React.createElement(currentView.component, viewRenderProps);
      }
    }

    return <NotFoundView />;
  }
}
