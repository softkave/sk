import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { IBoard } from "../../models/board/types";
import { updateBoardOpAction } from "../../redux/operations/board/updateBoard";
import { AppDispatch } from "../../redux/types";
import { flattenErrorList } from "../../utils/utils";
import useOperation, { getOpData } from "../hooks/useOperation";
import SprintOptionsForm, {
  ISprintOptionsFormValues,
} from "./SprintOptionsForm";

export interface ISprintOptionsFormContainerProps {
  board: IBoard;
  onClose: () => void;
}

const SprintOptionsFormContainer: React.FC<ISprintOptionsFormContainerProps> = (
  props
) => {
  const { onClose, board } = props;
  const dispatch: AppDispatch = useDispatch();
  const [cachedValues, setValues] = React.useState<
    ISprintOptionsFormValues | undefined
  >(board.sprintOptions);

  const saveOpStatus = useOperation();
  const errors = saveOpStatus.error
    ? flattenErrorList(saveOpStatus.error)
    : undefined;

  const onSubmit = async (values: ISprintOptionsFormValues) => {
    const data = { ...cachedValues, ...values };
    setValues(data);
    const result = await dispatch(
      updateBoardOpAction({
        boardId: board.customId,
        opId: saveOpStatus.opId,
        deleteOpOnComplete: true,
        data: {
          sprintOptions: data,
        },
      })
    );

    const op = unwrapResult(result);

    if (!op) {
      return;
    }

    const opStat = getOpData(op);

    if (!board.sprintOptions) {
      if (opStat.isCompleted) {
        message.success(SPRINTS_SETUP_SUCCESSFULLY);

        // TODO: route to sprints
        onClose();
      } else if (opStat.isError) {
        message.error(ERROR_SETTING_UP_SPRINTS);
      }
    } else {
      if (opStat.isCompleted) {
        message.success(SPRINT_OPTIONS_UPDATED_SUCCESSFULLY);
      } else if (opStat.isError) {
        message.error(ERROR_UPDATING_SPRINT_OPTIONS);
      }
    }
  };

  return (
    <SprintOptionsForm
      value={cachedValues as any}
      onClose={onClose}
      sprintOptions={board.sprintOptions}
      onSubmit={onSubmit}
      isSubmitting={saveOpStatus.isLoading}
      errors={errors}
    />
  );
};

export default React.memo(SprintOptionsFormContainer);

const SPRINTS_SETUP_SUCCESSFULLY = "Sprins setup successfully";
const ERROR_SETTING_UP_SPRINTS = "Error setting up sprints";
const SPRINT_OPTIONS_UPDATED_SUCCESSFULLY =
  "Sprint options updated successfully";
const ERROR_UPDATING_SPRINT_OPTIONS = "Error updating sprint options";
