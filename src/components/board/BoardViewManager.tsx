import React from "react";
import { IBlock } from "../../models/block/block";
import IView from "../../redux/view/view";
import ViewManager, { IRenderView } from "../view/ViewManager";
import Board, { IBoardProps } from "./Board";
import BoardError from "./BoardError";
import BoardLoading from "./BoardLoading";

export interface IBoardViewManagerProps {
  currentView: IView;
  block: IBlock;
  readyProps?: IBoardProps;
}

class BoardViewManager extends React.Component<IBoardViewManagerProps> {
  public render() {
    const { currentView, block, readyProps } = this.props;
    const renderViews: IRenderView[] = [
      {
        viewName: "loading",
        render() {
          return <BoardLoading block={block} />;
        }
      },
      {
        viewName: "error",
        render() {
          return <BoardError block={block} />;
        }
      },
      {
        viewName: "ready",
        render() {
          if (readyProps) {
            return <Board key={block.customId} block={block} {...readyProps} />;
          } else {
            return <BoardError block={block} />;
          }
        }
      }
    ];

    return (
      <ViewManager views={renderViews} currentViewName={currentView.viewName} />
    );
  }
}

export default BoardViewManager;
