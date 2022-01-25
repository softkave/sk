import React from "react";
import { useDispatch, useSelector } from "react-redux";
import OperationType from "../../redux/operations/OperationType";
import { getBoardOpAction } from "../../redux/operations/board/getBoard";
import { IAppState } from "../../redux/types";
import MessageList from "../MessageList";
import useOperation, { IOperationDerivedData } from "../hooks/useOperation";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import { IBoard } from "../../models/board/types";
import BoardSelectors from "../../redux/boards/selectors";
import BoardInternalDataContainer, {
  IBoardInternalDataContainerProps,
} from "./BoardInternalDataContainer";
import { messages } from "../../models/messages";

export interface IBoardContainerProps
  extends Omit<IBoardInternalDataContainerProps, "board" | "organizationId"> {
  boardId: string;
}

const BoardContainer: React.FC<IBoardContainerProps> = (props) => {
  const { boardId } = props;
  const dispatch = useDispatch();
  const board = useSelector<IAppState, IBoard>((state) =>
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
    [dispatch]
  );

  const loadBoardOp = useOperation(
    { type: OperationType.GetBoard },
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

  return (
    <BoardInternalDataContainer
      {...props}
      organizationId={board.rootBlockId}
      board={board}
    />
  );
};

export default BoardContainer;
