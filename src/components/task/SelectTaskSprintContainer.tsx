import { LoadingOutlined } from "@ant-design/icons/lib/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { IBlock } from "../../models/block/block";
import { ISprint } from "../../models/sprint/types";
import { updateBlockOpAction } from "../../redux/operations/block/updateBlock";
import { AppDispatch } from "../../redux/types";
import { getOpData } from "../hooks/useOperation";
import SelectTaskSprint, { BACKLOG } from "./SelectTaskSprint";

export interface ISelectTaskSprintContainerProps {
    task: IBlock;
    sprints: ISprint[];
    sprintsMap: { [key: string]: ISprint };
    disabled?: boolean;
    demo?: boolean;
    onAddNewSprint: () => void;
}

const SelectTaskSprintContainer: React.FC<ISelectTaskSprintContainerProps> = (
    props
) => {
    const { task, demo } = props;

    const [isLoading, setIsLoading] = React.useState(false);
    const dispatch: AppDispatch = useDispatch();

    const toggleLoading = React.useCallback(() => setIsLoading(!isLoading), [
        isLoading,
    ]);

    const onChangeStatus = React.useCallback(
        async (val: string) => {
            if (demo) {
                return false;
            }

            toggleLoading();

            const result = await dispatch(
                updateBlockOpAction({
                    blockId: task.customId,
                    data: {
                        taskSprint:
                            val === BACKLOG
                                ? null
                                : {
                                      sprintId: val,
                                  },
                    },
                    deleteOpOnComplete: true,
                })
            );

            const op = unwrapResult(result);

            if (op) {
                const opData = getOpData(op);

                if (opData.isError) {
                    message.error(ERROR_UPDATING_TASK_SPRINT);
                }
            }

            toggleLoading();
        },
        [demo, dispatch, task.customId, toggleLoading]
    );

    if (isLoading) {
        return <LoadingOutlined />;
    }

    return <SelectTaskSprint {...props} onChangeSprint={onChangeStatus} />;
};

export default React.memo(SelectTaskSprintContainer);

const ERROR_UPDATING_TASK_SPRINT = "Error updating task sprint";
