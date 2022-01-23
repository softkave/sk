import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IBoard } from "../../models/board/types";
import { IAppOrganization } from "../../models/organization/types";
import BoardSelectors from "../../redux/boards/selectors";
import { getBoardOpAction } from "../../redux/operations/board/getBoard";
import { getOrganizationCollaboratorsOpAction } from "../../redux/operations/collaborator/getOrganizationCollaborators";
import OperationType from "../../redux/operations/OperationType";
import { populateOrganizationRoomsOpAction } from "../../redux/operations/organization/populateOrganizationRooms";
import { getSprintsOpAction } from "../../redux/operations/sprint/getSprints";
import { getBoardTasksOpAction } from "../../redux/operations/task/getBoardTasks";
import { IAppState } from "../../redux/types";
import useOperation, {
  IMergedOperationStats,
  IOperationDerivedData,
  mergeOps,
} from "../hooks/useOperation";

// For loading org data necessary for initialization, like users, requests, etc.
export function useLoadOrgData(boardId: string): {
  loadingMessage?: string;
  errorMessage?: any;
  isComplete?: boolean;
} {
  const dispatch = useDispatch();
  const board = useSelector<IAppState, IBoard>(state => BoardSelectors.getOne(state, boardId));
  const loadBoard = React.useCallback(
    (loadProps: IOperationDerivedData) => {
      const shouldLoad = !loadProps.operation;

      if (shouldLoad) {
        dispatch(
          getBoardOpAction({
            boardId: boardId,
            opId: loadProps.opId,
          })
        );
      }
    },
    [dispatch, boardId]
  );

  const loadTasks = React.useCallback(
    (loadProps: IOperationDerivedData) => {
      const shouldLoad = !loadProps.operation;

      if (shouldLoad) {
        dispatch(
          getBoardTasksOpAction({
            boardId: boardId,
            opId: loadProps.opId,
          })
        );
      }
    },
    [dispatch, boardId]
  );

  const loadSprints = React.useCallback(
    (loadProps: IOperationDerivedData) => {
      const shouldLoad = !loadProps.operation;

      if (shouldLoad) {
        dispatch(
          getSprintsOpAction({
            boardId: boardId,
            opId: loadProps.opId,
          })
        );
      }
    },
    [dispatch, boardId]
  );

  const boardOp = useOperation(
    {
      resourceId: boardId,
      type: OperationType.GetBoard,
    },
    loadSprints,
    { deleteManagedOperationOnUnmount: false }
  );

  const sprintsOp = useOperation(
    {
      resourceId: boardId,
      type: OperationType.GetSprints,
    },
    loadSprints,
    { deleteManagedOperationOnUnmount: false }
  );

  const tasksOp = useOperation(
    {
      resourceId: boardId,
      type: OperationType.GetBoardTasks,
    },
    loadTasks,
    { deleteManagedOperationOnUnmount: false }
  );

  return {
    loadingMessage: 
  }
}
