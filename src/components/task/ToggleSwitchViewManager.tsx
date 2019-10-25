import React from "react";

import IView from "../../redux/view/view";
import ViewManager, { IRenderView } from "../view/ViewManager";
import ToggleSwitch, { IToggleSwitchProps } from "./ToggleSwitch";
import ToggleSwitchError from "./ToggleSwitchError";
import ToggleSwitchLoading from "./ToggleSwitchLoading";

export interface IToggleSwitchViewManagerProps {
  currentView: IView;
  readyProps?: IToggleSwitchProps;
}

class ToggleSwitchViewManager extends React.Component<
  IToggleSwitchViewManagerProps
> {
  public render() {
    const { currentView, readyProps } = this.props;
    const renderViews: IRenderView[] = [
      {
        viewName: "loading",
        render() {
          return <ToggleSwitchLoading />;
        }
      },
      {
        viewName: "error",
        render() {
          return <ToggleSwitchError />;
        }
      },
      {
        viewName: "ready",
        render() {
          if (readyProps) {
            return <ToggleSwitch {...readyProps} />;
          } else {
            return <ToggleSwitchError />;
          }
        }
      }
    ];

    return (
      <ViewManager views={renderViews} currentViewName={currentView.viewName} />
    );
  }
}

export default ToggleSwitchViewManager;
