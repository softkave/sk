import { unwrapResult } from "@reduxjs/toolkit";
import { message, Modal } from "antd";
import path from "path-browserify";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { Redirect } from "react-router-dom";
import { ISprint } from "../../models/sprint/types";
import { getSprintRemainingWorkingDays } from "../../models/sprint/utils";
import subscribeEvent from "../../net/socket/outgoing/subscribeEvent";
import unsubcribeEvent from "../../net/socket/outgoing/unsubscribeEvent";
import { getBoardTasksOpAction } from "../../redux/operations/task/getBoardTasks";
import OperationType from "../../redux/operations/OperationType";
import { getSprintsOpAction } from "../../redux/operations/sprint/getSprints";
import SprintSelectors from "../../redux/sprints/selectors";
import { AppDispatch, IAppState } from "../../redux/types";
import MessageList from "../MessageList";
import useOperation, {
  getOpData,
  IOperationDerivedData,
  mergeOps,
} from "../hooks/useOperation";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import Board from "./Board";
import { IBoardResourceTypePathMatch } from "./types";
import { IBoard } from "../../models/board/types";
import { appBoardRoutes } from "../../models/board/utils";
import { updateSprintOpAction } from "../../redux/operations/sprint/updateSprint";
import { getDateString } from "../../utils/utils";

export interface IBoardInternalDataContainerProps {
  board: IBoard;
  isMobile: boolean;
  isAppMenuFolded: boolean;
  onToggleFoldAppMenu: () => void;
  onClickDeleteBlock: (board: IBoard) => void;
}

const BoardInternalDataContainer: React.FC<IBoardInternalDataContainerProps> = (
  props
) => {
  const {
    board,
    isMobile,
    isAppMenuFolded,
    onClickDeleteBlock,
    onToggleFoldAppMenu,
  } = props;

  const dispatch: AppDispatch = useDispatch();
  const history = useHistory();
  const currentSprint = useSelector<IAppState, ISprint | undefined>((state) => {
    if (board.currentSprintId) {
      return SprintSelectors.getSprint(state, board.currentSprintId);
    }

    return undefined;
  });

  const boardPath = appBoardRoutes.board(board.rootBlockId, board.customId);
  const resourceTypeMatch = useRouteMatch<IBoardResourceTypePathMatch>(
    `${boardPath}/:resourceType`
  );

  const resourceType =
    resourceTypeMatch && resourceTypeMatch.params.resourceType;

  const loadTasks = React.useCallback(
    (loadProps: IOperationDerivedData) => {
      const shouldLoad = !loadProps.operation;

      if (shouldLoad) {
        dispatch(
          getBoardTasksOpAction({
            boardId: board.customId,
            opId: loadProps.opId,
          })
        );
      }
    },
    [dispatch, board]
  );

  const loadSprints = React.useCallback(
    (loadProps: IOperationDerivedData) => {
      const shouldLoad = !loadProps.operation;

      if (shouldLoad) {
        dispatch(
          getSprintsOpAction({
            boardId: board.customId,
            opId: loadProps.opId,
          })
        );
      }
    },
    [dispatch, board.customId]
  );

  const sprintsOp = useOperation(
    {
      resourceId: board.customId,
      type: OperationType.GetSprints,
    },
    loadSprints,
    { deleteManagedOperationOnUnmount: false }
  );

  const tasksOp = useOperation(
    {
      resourceId: board.customId,
      type: OperationType.GetBoardTasks,
    },
    loadTasks,
    { deleteManagedOperationOnUnmount: false }
  );

  // TODO: this code is duplicated in SprintsContainer
  const closeSprint = async (sprintId: string) => {
    const result = await dispatch(
      updateSprintOpAction({
        sprintId,
        deleteOpOnComplete: true,
        data: {
          endDate: getDateString(),
        },
      })
    );

    const op: any = unwrapResult(result);

    if (!op) {
      return;
    }

    const opStat = getOpData(op);

    if (opStat.isCompleted) {
      // TODO: duplicated in Board
      const sprintsPath = path.normalize(`${boardPath}/sprints`);
      history.push(sprintsPath);
      message.success(ENDED_SPRINT_SUCCESSFULLY);
    } else if (opStat.isError) {
      message.error(ERROR_CLOSING_SPRINT);
    }
  };

  const promptCloseSprint = () => {
    if (!currentSprint) {
      return;
    }

    const remainingWorkingDays = getSprintRemainingWorkingDays(currentSprint);
    let promptMessage = END_SPRINT_PROMPT_MESSAGE;

    if (remainingWorkingDays > 0) {
      promptMessage =
        getEndSprintRemainingWorkingDaysPromptMessage(remainingWorkingDays);
    }

    Modal.confirm({
      title: promptMessage,
      okText: YES,
      cancelText: NO,
      okType: "primary",
      okButtonProps: { danger: true },
      onOk: async () => closeSprint(currentSprint.customId),
      onCancel() {
        // do nothing
      },
    });
  };

  React.useEffect(() => {
    subscribeEvent([{ type: board.type as any, customId: board.customId }]);
    return () => {
      unsubcribeEvent([{ type: board.type as any, customId: board.customId }]);
    };
  }, [board.customId, board.type]);

  const ops = mergeOps([tasksOp, sprintsOp]);

  if (ops.loading) {
    return <LoadingEllipsis />;
  } else if (ops.errors) {
    return <MessageList fill messages={ops.errors} />;
  }

  // TODO: should we show error if block type is task ( it should never be task )?
  if (!resourceType) {
    const nextPath = path.normalize(boardPath + `/tasks`);
    return <Redirect to={nextPath} />;
  }

  return (
    <Board
      board={board}
      isAppMenuFolded={isAppMenuFolded}
      isMobile={isMobile}
      onClickDeleteBoard={onClickDeleteBlock}
      onToggleFoldAppMenu={onToggleFoldAppMenu}
      onCloseSprint={promptCloseSprint}
    />
  );
};

export default BoardInternalDataContainer;

const END_SPRINT_PROMPT_MESSAGE = "Are you sure you want to end this sprint?";
const ENDED_SPRINT_SUCCESSFULLY = "Sprint ended successfully";
const ERROR_CLOSING_SPRINT = "Error ending sprint";
const YES = "Yes";
const NO = "No";

const getEndSprintRemainingWorkingDaysPromptMessage = (
  remainingDays: number
) => {
  return `${END_SPRINT_PROMPT_MESSAGE} It has ${remainingDays} working day${
    remainingDays === 1 ? "" : "s"
  } remaining.`;
};