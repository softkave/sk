import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { IBoard } from "../../models/board/types";
import { ISprint } from "../../models/sprint/types";
import { ILoadingState } from "../../redux/key-value/types";
import { addSprintOpAction } from "../../redux/operations/sprint/addSprint";
import { updateSprintOpAction } from "../../redux/operations/sprint/updateSprint";
import SprintSelectors from "../../redux/sprints/selectors";
import { AppDispatch, IAppState } from "../../redux/types";
import { flattenErrorList } from "../../utils/utils";
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
    let prevSprint: ISprint | undefined = undefined;

    if (board.lastSprintId) {
      prevSprint = SprintSelectors.getSprint(state, board.lastSprintId);
    }

    if (prevSprint) {
      return prevSprint.sprintIndex + 1;
    } else {
      return 1;
    }
  });

  const [cachedValues, setValues] = React.useState<ISprintFormValues | undefined>(() => {
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

  const [loadingState, setLoadingState] = React.useState<ILoadingState>();
  const errors = loadingState?.error ? flattenErrorList(loadingState.error) : undefined;

  const onSubmit = async (values: ISprintFormValues) => {
    setValues(values);

    const result = props.sprint
      ? await dispatch(
          updateSprintOpAction({
            data: values,
            sprintId: props.sprint.customId,
          })
        )
      : await dispatch(
          addSprintOpAction({
            data: values,
            boardId: board.customId,
          })
        );

    const op = unwrapResult(result);
    setLoadingState(op);

    if (!props.sprint) {
      if (op.error) {
        message.error(ERROR_CREATING_SPRINT);
      } else {
        message.success(SPRINT_CREATED_SUCCESSFULLY);
        onClose();

        if (navigateOnCreate) {
          history.push(`/app/orgs/${board.workspaceId!}/boards/${board.customId}/sprints`);
        }
      }
    } else {
      if (op.error) {
        message.error(ERROR_UPDATING_SPRINT);
      } else {
        message.success(SPRINT_UPDATED_SUCCESSFULLY);
      }
    }
  };

  // TODO: auth checks
  const canUpdateSprint = true;

  return (
    <SprintForm
      value={cachedValues as any}
      onClose={onClose}
      sprint={thisSprint}
      onSubmit={onSubmit}
      isSubmitting={loadingState?.isLoading}
      errors={errors}
      existingSprints={existingSprints}
      disabled={loadingState?.isLoading || !canUpdateSprint}
    />
  );
};

export default React.memo(SprintFormContainer);

const SPRINT_CREATED_SUCCESSFULLY = "Sprint created successfully";
const ERROR_CREATING_SPRINT = "Error creating sprint";
const SPRINT_UPDATED_SUCCESSFULLY = "Sprint updated successfully";
const ERROR_UPDATING_SPRINT = "Error updating sprint";
