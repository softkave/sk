import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { IBoard } from "../../models/board/types";
import { ISprint } from "../../models/sprint/types";
import { addSprintOpAction } from "../../redux/operations/sprint/addSprint";
import { updateSprintOpAction } from "../../redux/operations/sprint/updateSprint";
import SprintSelectors from "../../redux/sprints/selectors";
import { AppDispatch, IAppState } from "../../redux/types";
import { flattenErrorList } from "../../utils/utils";
import useOperation, { getOpData } from "../hooks/useOperation";
import SprintForm, { ISprintFormValues } from "./SprintForm";

export interface ISprintFormContainerProps {
  board: IBoard;
  onClose: () => void;

  sprint?: ISprint;
  navigateOnCreate?: boolean;
}

const SprintFormContainer: React.FC<ISprintFormContainerProps> = (props) => {
  const { board, navigateOnCreate, onClose } = props;
  const dispatch: AppDispatch = useDispatch();
  const history = useHistory();
  const existingSprints = useSelector<IAppState, ISprint[]>((state) =>
    SprintSelectors.getBoardSprints(state, board.customId)
  );

  const nextSprintIndex = useSelector<IAppState, number>((state) => {
    let prevSprint: ISprint;

    if (board.lastSprintId) {
      prevSprint = SprintSelectors.getSprint(state, board.lastSprintId);
    }

    // @ts-ignore
    if (prevSprint) {
      return prevSprint.sprintIndex + 1;
    } else {
      return 1;
    }
  });

  const [cachedValues, setValues] = React.useState<
    ISprintFormValues | undefined
  >(() => {
    if (props.sprint) {
      return props.sprint;
    }

    return {
      name: `Sprint ${nextSprintIndex}`,
      duration: board.sprintOptions!.duration,
    };
  });

  const thisSprint = useSelector<IAppState, ISprint | undefined>((state) => {
    if (props.sprint) {
      return props.sprint;
    } else if (cachedValues?.name) {
      // To prevent sprint name exists error when creating a new sprint
      const name = cachedValues.name.toLowerCase();
      const sprintId = Object.keys(state.sprints).find((id) => {
        const sprint = state.sprints[id];

        if (sprint.boardId === board.customId) {
          return sprint.name === name;
        }

        return false;
      });

      if (sprintId) {
        return state.sprints[sprintId];
      }
    }

    return undefined;
  });

  const saveOpStatus = useOperation();
  const errors = saveOpStatus.error
    ? flattenErrorList(saveOpStatus.error)
    : undefined;

  const onSubmit = async (values: ISprintFormValues) => {
    setValues(values);

    const result = props.sprint
      ? await dispatch(
          updateSprintOpAction({
            data: values,
            sprintId: props.sprint.customId,
            opId: saveOpStatus.opId,
            deleteOpOnComplete: true,
          })
        )
      : await dispatch(
          addSprintOpAction({
            data: values,
            boardId: board.customId,
            opId: saveOpStatus.opId,
            deleteOpOnComplete: true,
          })
        );

    const op = unwrapResult(result);

    if (!op) {
      return;
    }

    const opStat = getOpData(op);

    if (!props.sprint) {
      if (opStat.isCompleted) {
        message.success(SPRINT_CREATED_SUCCESSFULLY);
        onClose();

        if (navigateOnCreate) {
          history.push(
            `/app/orgs/${board.rootBlockId!}/boards/${board.customId}/sprints`
          );
        }
      } else if (opStat.isError) {
        message.error(ERROR_CREATING_SPRINT);
      }
    } else {
      if (opStat.isCompleted) {
        message.success(SPRINT_UPDATED_SUCCESSFULLY);
      } else if (opStat.isError) {
        message.error(ERROR_UPDATING_SPRINT);
      }
    }
  };

  return (
    <SprintForm
      value={cachedValues as any}
      onClose={onClose}
      sprint={thisSprint}
      onSubmit={onSubmit}
      isSubmitting={saveOpStatus.isLoading}
      errors={errors}
      existingSprints={existingSprints}
    />
  );
};

export default React.memo(SprintFormContainer);

const SPRINT_CREATED_SUCCESSFULLY = "Sprint created successfully";
const ERROR_CREATING_SPRINT = "Error creating sprint";
const SPRINT_UPDATED_SUCCESSFULLY = "Sprint updated successfully";
const ERROR_UPDATING_SPRINT = "Error updating sprint";
