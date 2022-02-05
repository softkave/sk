import { Modal } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ISprint } from "../../models/sprint/types";
import {
  getCurrentAndUpcomingSprints,
  getSprintRemainingWorkingDays,
} from "../../models/sprint/utils";
import { ITask } from "../../models/task/types";
import { deleteSprintOpAction } from "../../redux/operations/sprint/deleteSprint";
import { endSprintOpAction } from "../../redux/operations/sprint/endSprint";
import { startSprintOpAction } from "../../redux/operations/sprint/startSprint";
import SprintSelectors from "../../redux/sprints/selectors";
import { AppDispatch, IAppState } from "../../redux/types";
import handleOpResult from "../utilities/handleOpResult";
import Sprints from "./Sprints";
import { ITasksContainerRenderFnProps } from "./TasksContainer";

export interface ISprintsContainerProps extends ITasksContainerRenderFnProps {
  onUpdateSprint: (sprint: ISprint) => void;
  onClickUpdateTask: (task: ITask) => void;
}

const SprintsContainer: React.FC<ISprintsContainerProps> = (props) => {
  const {
    board,
    onUpdateSprint,
    onClickUpdateTask: onClickUpdateBlock,
  } = props;

  const dispatch: AppDispatch = useDispatch();
  const sprints = useSelector<IAppState, ISprint[]>((state) =>
    SprintSelectors.getBoardSprints(state, board.customId)
  );

  const currentAndUpcomingSprints = getCurrentAndUpcomingSprints(sprints);
  const onDeleteSprint = async (sprintId: string) => {
    const result = await dispatch(
      deleteSprintOpAction({
        sprintId,
        deleteOpOnComplete: true,
      })
    );

    handleOpResult({
      result,
      successMessage: SPRINT_DELETED_SUCCESSFULLY,
      errorMessage: ERROR_DELETING_SPRINT,
    });
  };

  const promptDeleteSprint = (sprintId: string) => {
    Modal.confirm({
      title: DELETE_SPRINT_PROMPT_MESSAGE,
      okText: YES,
      cancelText: NO,
      okType: "primary",
      okButtonProps: { danger: true },
      onOk: async () => onDeleteSprint(sprintId),
      onCancel() {
        // do nothing
      },
    });
  };

  const startSprint = async (sprintId: string) => {
    const result = await dispatch(
      startSprintOpAction({
        sprintId,
        deleteOpOnComplete: true,
      })
    );

    handleOpResult({
      result,
      successMessage: SPRINT_STARTED_SUCCESSFULLY,
      errorMessage: ERROR_STARTING_SPRINT,
    });
  };

  const promptStartSprint = (sprintId: string) => {
    Modal.confirm({
      title: START_SPRINT_PROMPT_MESSAGE,
      okText: YES,
      cancelText: NO,
      okType: "primary",
      onOk: async () => startSprint(sprintId),
      onCancel() {
        // do nothing
      },
    });
  };

  const closeSprint = async (sprintId: string) => {
    const result = await dispatch(
      endSprintOpAction({
        sprintId,
        deleteOpOnComplete: true,
      })
    );

    handleOpResult({
      result,
      successMessage: ENDED_SPRINT_SUCCESSFULLY,
      errorMessage: ERROR_CLOSING_SPRINT,
    });
  };

  const promptCloseSprint = (sprint: ISprint) => {
    const remainingWorkingDays = getSprintRemainingWorkingDays(sprint);
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
      onOk: async () => closeSprint(sprint.customId),
      onCancel() {
        // do nothing
      },
    });
  };

  // TODO: make this better, cause sprints array most likely
  // will be created on every render cause of useSelector
  const wrappedOnUpdateSprint = React.useCallback(
    (sprintId: string) =>
      onUpdateSprint(sprints.find((item) => item.customId === sprintId)!),
    [sprints]
  );

  return (
    <Sprints
      {...props}
      sprints={currentAndUpcomingSprints}
      onClickUpdateTask={onClickUpdateBlock}
      onDeleteSprint={promptDeleteSprint}
      onStartSprint={promptStartSprint}
      onEndSprint={promptCloseSprint}
      onUpdateSprint={wrappedOnUpdateSprint}
    />
  );
};

export default SprintsContainer;

const SPRINT_DELETED_SUCCESSFULLY = "Sprint deleted successfully";
const ERROR_DELETING_SPRINT = "Error deleting sprint";
const SPRINT_STARTED_SUCCESSFULLY = "Sprint started successfully";
const ERROR_STARTING_SPRINT = "Error starting sprint";
const DELETE_SPRINT_PROMPT_MESSAGE =
  "Are you sure you want to delete this sprint?";
const YES = "Yes";
const NO = "No";
const START_SPRINT_PROMPT_MESSAGE =
  "Are you sure you want to start this sprint?";
const END_SPRINT_PROMPT_MESSAGE = "Are you sure you want to end this sprint?";
const ENDED_SPRINT_SUCCESSFULLY = "Sprint ended successfully";
const ERROR_CLOSING_SPRINT = "Error ending sprint";

const getEndSprintRemainingWorkingDaysPromptMessage = (
  remainingDays: number
) => {
  return `${END_SPRINT_PROMPT_MESSAGE} It has ${remainingDays} working day${
    remainingDays === 1 ? "" : "s"
  } remaining.`;
};
