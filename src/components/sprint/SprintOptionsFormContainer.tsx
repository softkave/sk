import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { IBlock } from "../../models/block/block";
import { setupSprintsOpAction } from "../../redux/operations/sprint/setupSprints";
import { updateSprintOptionsOpAction } from "../../redux/operations/sprint/updateSprintOptions";
import { AppDispatch } from "../../redux/types";
import { flattenErrorListWithDepthInfinite } from "../../utils/utils";
import useOperation, { getOpStats } from "../hooks/useOperation";
import SprintOptionsForm, {
    ISprintOptionsFormValues,
} from "./SprintOptionsForm";

export interface ISprintOptionsFormContainerProps {
    board: IBlock;
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
        ? flattenErrorListWithDepthInfinite(saveOpStatus.error)
        : undefined;

    const onSubmit = async (values: ISprintOptionsFormValues) => {
        const data = { ...cachedValues, ...values };

        setValues(data);

        const result = board.sprintOptions
            ? await dispatch(
                  updateSprintOptionsOpAction({
                      data,
                      boardId: board.customId,
                      opId: saveOpStatus.opId,
                  })
              )
            : await dispatch(
                  setupSprintsOpAction({
                      data,
                      boardId: board.customId,
                      opId: saveOpStatus.opId,
                  })
              );

        const op = unwrapResult(result);

        if (!op) {
            return;
        }

        const opStat = getOpStats(op);

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
