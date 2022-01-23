import React from "react";
import { useDispatch, useSelector } from "react-redux";
import OperationType from "../../redux/operations/OperationType";
import { AppDispatch, IAppState } from "../../redux/types";
import MessageList from "../MessageList";
import useOperation, { IOperationDerivedData } from "../hooks/useOperation";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import { IBoard } from "../../models/board/types";
import { getOrganizationBoards } from "../../redux/boards/selectors";
import { getOrganizationBoardsOpAction } from "../../redux/operations/board/getOrganizationBoards";
import BoardList, { IBoardListProps } from "./BoardList";

export interface IBoardListContainerProps
  extends Omit<IBoardListProps, "boards"> {
  organizationId: string;
}

const BoardListContainer: React.FC<IBoardListContainerProps> = (props) => {
  const { organizationId } = props;
  const dispatch: AppDispatch = useDispatch();
  const boards = useSelector<IAppState, IBoard[]>((state) =>
    getOrganizationBoards(state, organizationId)
  );

  const loadChildren = React.useCallback(
    (loadProps: IOperationDerivedData) => {
      if (!loadProps.operation) {
        dispatch(
          getOrganizationBoardsOpAction({
            organizationId,
            opId: loadProps.opId,
          })
        );
      }
    },
    [dispatch, organizationId]
  );

  const op = useOperation(
    {
      resourceId: organizationId,
      type: OperationType.GetOrganizationBoards,
    },
    loadChildren,
    { deleteManagedOperationOnUnmount: false }
  );

  if (op.isLoading || !!!op.operation) {
    return <LoadingEllipsis />;
  } else if (op.error) {
    return <MessageList messages={op.error} />;
  }

  return <BoardList {...props} boards={boards} />;
};

export default React.memo(BoardListContainer);
