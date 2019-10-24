import React from "react";
import { IBlock } from "../../models/block/block";
import IView from "../../redux/view/view";
import ViewManager, { IRenderView } from "../view/ViewManager";
import Group, { IGroupProps } from "./Group";
import GroupError from "./GroupError";
import GroupLoading from "./GroupLoading";

export interface IGroupViewManagerProps {
  currentView: IView;
  group: IBlock;
  readyProps?: IGroupProps;
}

class GroupViewManager extends React.Component<IGroupViewManagerProps> {
  public render() {
    console.log(this.props);
    const { currentView, group, readyProps } = this.props;
    const renderViews: IRenderView[] = [
      {
        viewName: "loading",
        render() {
          return <GroupLoading group={group} />;
        }
      },
      {
        viewName: "error",
        render() {
          return <GroupError group={group} />;
        }
      },
      {
        viewName: "ready",
        render() {
          if (readyProps) {
            return <Group group={group} {...readyProps} />;
          } else {
            return <GroupError group={group} />;
          }
        }
      }
    ];

    return (
      <ViewManager views={renderViews} currentViewName={currentView.viewName} />
    );
  }
}

export default GroupViewManager;
