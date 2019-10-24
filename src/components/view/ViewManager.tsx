import isFunction from "lodash/isFunction";
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
  onMount?: (props: IViewManagerProps) => void;
}

export default class ViewManager extends React.Component<IViewManagerProps> {
  public componentDidMount() {
    const { onMount } = this.props;

    if (isFunction(onMount)) {
      onMount(this.props);
    }
  }

  public render() {
    const { views, currentViewName } = this.props;
    const currentView = views.find(view => {
      return view.viewName === currentViewName;
    });

    if (currentView) {
      if (currentView.render) {
        return currentView.render();
      } else if (currentView.renderedComponent) {
        return React.cloneElement(currentView.renderedComponent);
      } else if (currentView.component) {
        return React.createElement(currentView.component);
      }
    }

    return <NotFoundView />;
  }
}
