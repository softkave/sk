import React from "react";
import { currentOrgViewName } from "../../redux/view/orgs";
import { currentProjectViewName } from "../../redux/view/project";
import IView from "../../redux/view/view";
import BoardContainer, { IBoardContainerProps } from "../board/BoardContainer";
import BoardError from "../board/BoardError";
import BoardLoading from "../board/BoardLoading";
import ViewManager, { IRenderView } from "../view/ViewManager";
import Orgs, { IOrgsProps } from "./Orgs";

export interface IOrgsViewManager {
  view: IView;
  orgsProps?: IOrgsProps;
  currentBlockProps?: IBoardContainerProps;
}

class OrgsViewManager extends React.Component<IOrgsViewManager> {
  public render() {
    const { view, orgsProps, currentBlockProps } = this.props;
    const renderViews: IRenderView[] = [
      {
        viewName: "loading",
        render() {
          return <BoardLoading />;
        }
      },
      {
        viewName: "error",
        render() {
          return <BoardError />;
        }
      },
      {
        viewName: "ready",
        render() {
          if (orgsProps) {
            return <Orgs {...orgsProps} />;
          } else {
            return <BoardError />;
          }
        }
      },
      {
        viewName: currentOrgViewName,
        render() {
          if (currentBlockProps) {
            return <BoardContainer {...currentBlockProps} />;
          } else {
            return <BoardError />;
          }
        }
      },
      {
        viewName: currentProjectViewName,
        render() {
          if (currentBlockProps) {
            return <BoardContainer {...currentBlockProps} />;
          } else {
            return <BoardError />;
          }
        }
      }
    ];

    return <ViewManager views={renderViews} currentViewName={view.viewName} />;
  }
}

export default OrgsViewManager;
