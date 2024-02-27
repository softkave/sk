import React from "react";
import { useSelector } from "react-redux";
import { IBoard } from "../../models/board/types";
import { appMessages } from "../../models/messages";
import BoardSelectors from "../../redux/boards/selectors";
import { appLoadingKeys } from "../../redux/key-value/types";
import { getBoardOpAction } from "../../redux/operations/board/getBoard";
import { AppDispatch, IAppState } from "../../redux/types";
import { useLoadingNode } from "../hooks/useLoadingNode";
import { useLoadingStateWithOp } from "../hooks/useLoadingState";
import MessageList from "../MessageList";
import BoardInternalDataContainer, {
  IBoardInternalDataContainerProps,
} from "./BoardInternalDataContainer";

export interface IBoardContainerProps extends Omit<IBoardInternalDataContainerProps, "board"> {
  boardId: string;
  organizationId: string;
}

const BoardContainer: React.FC<IBoardContainerProps> = (props) => {
  const { boardId, organizationId } = props;
  const board = useSelector<IAppState, IBoard | undefined>((state) =>
    BoardSelectors.getOne(state, boardId)
  );

  const loadBoard = React.useCallback(
    async (dispatch: AppDispatch) => {
      await dispatch(
        getBoardOpAction({
          boardId,
          key: appLoadingKeys.board(organizationId, boardId),
        })
      );
    },
    [boardId, organizationId]
  );

  const loadBoardOp = useLoadingStateWithOp({
    key: appLoadingKeys.board(organizationId, boardId),
    initFn: loadBoard,
  });
  const loadingNode = useLoadingNode(loadBoardOp.loadingState);

  if (loadingNode.stateNode) {
    return loadingNode.stateNode;
  }
  if (!board) {
    return <MessageList shouldFillParent maxWidth messages={appMessages.boardNotFound} />;
  }

  return <BoardInternalDataContainer {...props} board={board} />;
};

export default BoardContainer;
