import { Modal } from "antd";
import path from "path-browserify";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router";
import { Redirect } from "react-router-dom";
import { appBoardPaths } from "../../models/app/routes";
import { SystemResourceType } from "../../models/app/types";
import { IBoard } from "../../models/board/types";
import { ISprint } from "../../models/sprint/types";
import { getSprintRemainingWorkingDays } from "../../models/sprint/utils";
import subscribeEvent from "../../net/socket/outgoing/subscribeEvent";
import unsubcribeEvent from "../../net/socket/outgoing/unsubscribeEvent";
import { appLoadingKeys } from "../../redux/key-value/types";
import { getSprintsOpAction } from "../../redux/operations/sprint/getSprints";
import { updateSprintOpAction } from "../../redux/operations/sprint/updateSprint";
import { getBoardTasksOpAction } from "../../redux/operations/task/getBoardTasks";
import SprintSelectors from "../../redux/sprints/selectors";
import { AppDispatch, IAppState } from "../../redux/types";
import { getDateString } from "../../utils/utils";
import { useLoadingNode } from "../hooks/useLoadingNode";
import { useLoadingStateWithOp } from "../hooks/useLoadingState";
import handleOpResult from "../utils/handleOpResult";
import Board from "./Board";
import { IBoardResourceTypePathMatch } from "./types";

export interface IBoardInternalDataContainerProps {
  board: IBoard;
  isMobile: boolean;
  isAppMenuFolded: boolean;
  onToggleFoldAppMenu: () => void;
  onClickDeleteBlock: (board: IBoard) => void;
}

const BoardInternalDataContainer: React.FC<IBoardInternalDataContainerProps> = (props) => {
  const { board, isMobile, isAppMenuFolded, onClickDeleteBlock, onToggleFoldAppMenu } = props;

  const dispatch: AppDispatch = useDispatch();
  const currentSprint = useSelector<IAppState, ISprint | undefined>((state) => {
    if (board.currentSprintId) {
      return SprintSelectors.getSprint(state, board.currentSprintId);
    }

    return undefined;
  });

  const boardPath = appBoardPaths.board(board.workspaceId, board.customId);
  const resourceTypeMatch = useRouteMatch<IBoardResourceTypePathMatch>(
    `${boardPath}/:resourceType`
  );

  const resourceType = resourceTypeMatch && resourceTypeMatch.params.resourceType;

  const loadTasks = React.useCallback(
    (dispatch: AppDispatch) => {
      dispatch(
        getBoardTasksOpAction({
          boardId: board.customId,
          key: appLoadingKeys.boardTasks(board.workspaceId, board.customId),
        })
      );
    },
    [board]
  );

  const loadSprints = React.useCallback(
    (dispatch: AppDispatch) => {
      dispatch(
        getSprintsOpAction({
          boardId: board.customId,
          key: appLoadingKeys.boardSprints(board.workspaceId, board.customId),
        })
      );
    },
    [board.customId, board.workspaceId]
  );

  const sprintsOp = useLoadingStateWithOp({
    key: appLoadingKeys.boardSprints(board.workspaceId, board.customId),
    initFn: loadSprints,
  });
  const tasksOp = useLoadingStateWithOp({
    key: appLoadingKeys.boardTasks(board.workspaceId, board.customId),
    initFn: loadTasks,
  });

  // TODO: this code is duplicated in SprintsContainer
  const closeSprint = async (sprintId: string) => {
    const result = await dispatch(
      updateSprintOpAction({
        sprintId,
        data: {
          endDate: getDateString(),
        },
      })
    );

    handleOpResult({
      result,
      errorMessage: ERROR_CLOSING_SPRINT,
      successMessage: ENDED_SPRINT_SUCCESSFULLY,
    });
  };

  const promptCloseSprint = () => {
    if (!currentSprint) {
      return;
    }

    const remainingWorkingDays = getSprintRemainingWorkingDays(currentSprint);
    let promptMessage = END_SPRINT_PROMPT_MESSAGE;

    if (remainingWorkingDays > 0) {
      promptMessage = getEndSprintRemainingWorkingDaysPromptMessage(remainingWorkingDays);
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
    subscribeEvent([{ type: SystemResourceType.Board, customId: board.customId }]);
    return () => {
      unsubcribeEvent([{ type: SystemResourceType.Board, customId: board.customId }]);
    };
  }, [board.customId]);

  const loadingNode = useLoadingNode(tasksOp.loadingState, sprintsOp.loadingState);
  if (loadingNode.stateNode) {
    return loadingNode.stateNode;
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

const getEndSprintRemainingWorkingDaysPromptMessage = (remainingDays: number) => {
  return `${END_SPRINT_PROMPT_MESSAGE} It has ${remainingDays} working day${
    remainingDays === 1 ? "" : "s"
  } remaining`;
};
