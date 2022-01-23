import React from "react";
import { useSelector } from "react-redux";
import { IBoard } from "../../models/board/types";
import BoardSelectors from "../../redux/boards/selectors";
import { IAppState } from "../../redux/types";
import Message from "../Message";

const DEFAULT_NOT_FOUND_TEXT = "Board not found.";

export interface IBoardExistsContainerProps {
  boardId: string;
  notFoundMessage?: string;
  render?: (board: IBoard) => React.ReactElement;
}

const BoardExistsContainer: React.FC<IBoardExistsContainerProps> = (props) => {
  const { boardId, notFoundMessage, render } = props;
  const board = useSelector<IAppState, IBoard | undefined>((state) =>
    BoardSelectors.getOne(state, boardId)
  );

  if (!board) {
    return <Message message={notFoundMessage || DEFAULT_NOT_FOUND_TEXT} />;
  }

  return render!(board);
};

export default BoardExistsContainer;
