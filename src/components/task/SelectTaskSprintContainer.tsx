import { LoadingOutlined } from "@ant-design/icons/lib/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { IBlock } from "../../models/block/block";
import { ISprint } from "../../models/sprint/types";
import { IUser } from "../../models/user/user";
import { updateBlockOpAction } from "../../redux/operations/block/updateBlock";
import { AppDispatch } from "../../redux/types";
import { getDateString } from "../../utils/utils";
import useOperation, { getOpStats } from "../hooks/useOperation";
import SelectTaskSprint, { BACKLOG } from "./SelectTaskSprint";

export interface ISelectTaskSprintContainerProps {
    task: IBlock;
    user: IUser;
    sprints: ISprint[];
    sprintsMap: { [key: string]: ISprint };
    disabled?: boolean;
    demo?: boolean;
    onAddNewSprint: () => void;
}

const SelectTaskSprintContainer: React.FC<ISelectTaskSprintContainerProps> = (
    props
) => {
    const { task, demo, user } = props;

    const dispatch: AppDispatch = useDispatch();
    const updateOp = useOperation();

    const onChangeStatus = React.useCallback(
        async (val: string) => {
            if (demo) {
                return false;
            }

            const result = await dispatch(
                updateBlockOpAction({
                    opId: updateOp.opId,
                    block: task,
                    data: {
                        taskSprint:
                            val === BACKLOG
                                ? null
                                : {
                                      sprintId: val,
                                      assignedAt: getDateString(),
                                      assignedBy: user.customId,
                                  },
                    },
                })
            );

            const op = unwrapResult(result);

            if (!op) {
                return false;
            }

            const opStat = getOpStats(op);

            if (opStat.isError) {
                message.error(ERROR_UPDATING_TASK_SPRINT);
                return false;
            }

            return true;
        },
        [demo, dispatch, task, updateOp.opId, user.customId]
    );

    if (updateOp.isLoading) {
        return <LoadingOutlined />;
    }

    return <SelectTaskSprint {...props} onChangeSprint={onChangeStatus} />;
};

export default React.memo(SelectTaskSprintContainer);

const ERROR_UPDATING_TASK_SPRINT = "Error updating task sprint";
