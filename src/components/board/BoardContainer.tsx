import React from "react";
import { useSelector } from "react-redux";
import { IBoard } from "../../models/board/types";
import { messages } from "../../models/messages";
import BoardSelectors from "../../redux/boards/selectors";
import { getBoardOpAction } from "../../redux/operations/board/getBoard";
import OperationType from "../../redux/operations/OperationType";
import { IAppState } from "../../redux/types";
import { useAppDispatch } from "../hooks/redux";
import useOperation, { IOperationDerivedData } from "../hooks/useOperation";
import MessageList from "../MessageList";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import BoardInternalDataContainer, {
  IBoardInternalDataContainerProps,
} from "./BoardInternalDataContainer";

export interface IBoardContainerProps
  extends Omit<IBoardInternalDataContainerProps, "board" | "organizationId"> {
  boardId: string;
}

const BoardContainer: React.FC<IBoardContainerProps> = (props) => {
  const { boardId } = props;
  const dispatch = useAppDispatch();
  const board = useSelector<IAppState, IBoard | undefined>((state) =>
    BoardSelectors.getOne(state, boardId)
  );

  const loadBoard = React.useCallback(
    async (loadProps: IOperationDerivedData) => {
      const operation = loadProps.operation;
      const shouldLoad = !operation && !board;

      if (shouldLoad) {
        await dispatch(
          getBoardOpAction({
            boardId,
            opId: loadProps.opId,
          })
        );
      }
    },
    [dispatch, board, boardId]
  );

  const loadBoardOp = useOperation(
    { type: OperationType.GetBoard, resourceId: boardId },
    loadBoard,
    {
      deleteManagedOperationOnUnmount: false,
    }
  );

  if (loadBoardOp.isLoading || (!board && !loadBoardOp.operation)) {
    return <LoadingEllipsis />;
  } else if (loadBoardOp.error) {
    return <MessageList fill messages={loadBoardOp.error} />;
  }

  if (!board) {
    return <MessageList fill messages={messages.boardNotFound} />;
  }

  return <BoardInternalDataContainer {...props} board={board} />;
};

export default BoardContainer;
