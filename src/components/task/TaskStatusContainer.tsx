import { LoadingOutlined } from "@ant-design/icons/lib/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import {
    IBlock,
    IBlockStatus,
    IBoardTaskResolution,
} from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { updateBlockOperationAction } from "../../redux/operations/block/updateBlock";
import { AppDispatch } from "../../redux/types";
import { getDateString } from "../../utils/utils";
import useOperation, { getOpStats } from "../hooks/useOperation";
import TaskStatus from "./TaskStatus";

export interface ITaskStatusContainerProps {
    task: IBlock;
    statusList: IBlockStatus[];
    resolutionsList: IBoardTaskResolution[];
    user: IUser;
    onSelectAddNewStatus: () => void;
    onSelectAddNewResolution: () => void;

    demo?: boolean;
    className?: string;
}

// TODO: should we make updates locally first before persisting it in the server for better UX?
// and for client-side only work

const TaskStatusContainer: React.FC<ITaskStatusContainerProps> = (props) => {
    const { task, className, demo, statusList, resolutionsList, user } = props;
    const dispatch: AppDispatch = useDispatch();
    const updateOp = useOperation();

    const onChangeStatus = React.useCallback(
        async (statusId: string, resolutionId?: string) => {
            if (demo) {
                return false;
            }

            const lastStatus = statusList[statusList.length - 1];
            const isLastStatus = statusId === lastStatus.customId;
            const update: Partial<IBlock> = {
                status: statusId,
                statusAssignedAt: getDateString(),
                statusAssignedBy: user.customId,
            };

            if (!isLastStatus && task.taskResolution) {
                update.taskResolution = null;
            }

            if (resolutionId) {
                update.taskResolution = resolutionId;
            }

            const result = await dispatch(
                updateBlockOperationAction({
                    opId: updateOp.opId,
                    block: task,
                    data: update,
                })
            );

            const op = unwrapResult(result);

            if (!op) {
                return false;
            }

            const opStat = getOpStats(op);

            if (opStat.isError) {
                message.error("Error updating task status");
                return false;
            }

            return true;
        },
        [demo, dispatch, statusList, task, updateOp.opId, user.customId]
    );

    const onChangeResolution = React.useCallback(
        async (value) => {
            if (demo) {
                return;
            }

            const result = await dispatch(
                updateBlockOperationAction({
                    opId: updateOp.opId,
                    block: task,
                    data: {
                        taskResolution: value,
                    },
                })
            );

            const op = unwrapResult(result);

            if (!op) {
                return;
            }

            const opStat = getOpStats(op);

            if (opStat.isError) {
                message.error("Error updating task resolution");
            }
        },
        [demo, dispatch, task, updateOp.opId]
    );

    if (updateOp.isLoading) {
        return <LoadingOutlined />;
    }

    return (
        <TaskStatus
            {...props}
            disabled={demo}
            className={className}
            task={task}
            statusList={statusList}
            resolutionsList={resolutionsList}
            onChangeStatus={onChangeStatus}
            onChangeResolution={onChangeResolution}
        />
    );
};

export default React.memo(TaskStatusContainer);
