import { LoadingOutlined } from "@ant-design/icons/lib/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import {
    IBlock,
    IBlockStatus,
    IBoardTaskResolution,
    IFormBlock,
} from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { updateBlockOpAction } from "../../redux/operations/block/updateBlock";
import { AppDispatch } from "../../redux/types";
import { getOpData } from "../hooks/useOperation";
import TaskStatus from "./TaskStatus";

export interface ITaskStatusContainerProps {
    task: IBlock;
    statusList: IBlockStatus[];
    resolutionsList: IBoardTaskResolution[];
    statusMap: { [key: string]: IBlockStatus };
    resolutionsMap: { [key: string]: IBoardTaskResolution };
    user: IUser;
    onSelectAddNewStatus: () => void;
    onSelectAddNewResolution: () => void;

    demo?: boolean;
    className?: string;
}

const TaskStatusContainer: React.FC<ITaskStatusContainerProps> = (props) => {
    const { task, demo, statusList, user } = props;

    const [isLoading, setIsLoading] = React.useState(false);
    const dispatch: AppDispatch = useDispatch();

    const toggleLoading = React.useCallback(() => setIsLoading(!isLoading), [
        isLoading,
    ]);

    const onChangeStatus = React.useCallback(
        async (statusId: string, resolutionId?: string) => {
            if (demo) {
                return;
            }

            toggleLoading();

            const lastStatus = statusList[statusList.length - 1];
            const isLastStatus = statusId === lastStatus.customId;
            const update: Partial<IFormBlock> = {
                status: statusId,
            };

            if (!isLastStatus && task.taskResolution) {
                update.taskResolution = null;
            }

            if (resolutionId) {
                update.taskResolution = resolutionId;
            }

            const result = await dispatch(
                updateBlockOpAction({
                    blockId: task.customId,
                    data: update,
                    deleteOpOnComplete: true,
                })
            );

            const op = unwrapResult(result);

            if (op) {
                const opStat = getOpData(op);

                if (opStat.isError) {
                    message.error("Error updating task status");
                }
            }

            toggleLoading();
        },
        [
            demo,
            dispatch,
            statusList,
            task.customId,
            user.customId,
            toggleLoading,
        ]
    );

    const onChangeResolution = React.useCallback(
        async (value) => {
            if (demo) {
                return;
            }

            toggleLoading();

            const result = await dispatch(
                updateBlockOpAction({
                    blockId: task.customId,
                    data: {
                        taskResolution: value,
                    },
                    deleteOpOnComplete: true,
                })
            );

            const op = unwrapResult(result);

            if (op) {
                const opStat = getOpData(op);

                if (opStat.isError) {
                    message.error("Error updating task resolution");
                }
            }

            toggleLoading();
        },
        [demo, dispatch, task.customId, toggleLoading]
    );

    if (isLoading) {
        return <LoadingOutlined />;
    }

    return (
        <TaskStatus
            {...props}
            onChangeStatus={onChangeStatus}
            onChangeResolution={onChangeResolution}
        />
    );
};

export default React.memo(TaskStatusContainer);
