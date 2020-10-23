import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { IBlock } from "../../models/block/block";
import { ISprint } from "../../models/sprint/types";
import { addSprintOpAction } from "../../redux/operations/sprint/addSprint";
import { updateSprintOpAction } from "../../redux/operations/sprint/updateSprint";
import SprintSelectors from "../../redux/sprints/selectors";
import { AppDispatch, IAppState } from "../../redux/types";
import { flattenErrorListWithDepthInfinite } from "../../utils/utils";
import useOperation, { getOpStats } from "../hooks/useOperation";
import SprintForm, { ISprintFormValues } from "./SprintForm";

export interface ISprintFormContainerProps {
    board: IBlock;
    onClose: () => void;

    sprint?: ISprint;
}

const SprintFormContainer: React.FC<ISprintFormContainerProps> = (props) => {
    const { onClose, board } = props;

    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();

    const existingSprints = useSelector<IAppState, ISprint[]>((state) =>
        SprintSelectors.getBoardSprints(state, board.customId)
    );

    const [cachedValues, setValues] = React.useState<
        ISprintFormValues | undefined
    >(props.sprint);

    const saveOpStatus = useOperation();
    const errors = saveOpStatus.error
        ? flattenErrorListWithDepthInfinite(saveOpStatus.error)
        : undefined;

    const onSubmit = async (values: ISprintFormValues) => {
        const data = { ...cachedValues, ...values };

        setValues(data);

        const result = props.sprint
            ? await dispatch(
                  updateSprintOpAction({
                      data,
                      sprintId: props.sprint.customId,
                      opId: saveOpStatus.opId,
                  })
              )
            : await dispatch(
                  addSprintOpAction({
                      ...data,
                      boardId: board.customId,
                      opId: saveOpStatus.opId,
                  })
              );

        const op = unwrapResult(result);

        if (!op) {
            return;
        }

        const opStat = getOpStats(op);

        if (!props.sprint) {
            if (opStat.isCompleted) {
                message.success(SPRINT_CREATED_SUCCESSFULLY);
                history.push(
                    `/app/organizations/${board.rootBlockId!}/boards/${
                        board.customId
                    }/sprints`
                );

                onClose();
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
            sprint={props.sprint}
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
