import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { updateBlockOpAction } from "../../redux/operations/block/updateBlock";
import { AppDispatch } from "../../redux/types";
import { getOpData } from "../hooks/useOperation";
import TaskThumbnailSubTasks from "./TaskThumbnailSubTasks";

export interface ITaskSubTasksContainerProps {
    task: IBlock;
    user: IUser;

    demo?: boolean;
}

const TaskSubTasksContainer: React.FC<ITaskSubTasksContainerProps> = (
    props
) => {
    const { task, demo, user } = props;

    const dispatch: AppDispatch = useDispatch();

    // TODO: we can only toggle one at a time for now,
    // look into removing this restriction

    const onToggleTask = React.useCallback(
        async (subTaskIndex: number) => {
            if (demo) {
                return;
            }

            const subTasks = Array.from(task.subTasks || []);
            let subTask = subTasks[subTaskIndex];

            if (!subTask) {
                return;
            }

            // TODO: can we only update the sub-task and avoid the unnecessary compute?
            subTask = { ...subTask };
            subTask.completedBy = subTask.completedBy ? null : user.customId;
            subTasks[subTaskIndex] = subTask;

            const result = await dispatch(
                updateBlockOpAction({
                    blockId: task.customId,
                    data: {
                        subTasks,
                    },
                    deleteOpOnComplete: true,
                })
            );

            const op = unwrapResult(result);

            if (op) {
                const opData = getOpData(op);

                if (opData.isError) {
                    message.error("Error updating sub-task");
                }
            }
        },
        [demo, dispatch, task.customId, user.customId]
    );

    return <TaskThumbnailSubTasks task={task} onToggleSubTask={onToggleTask} />;
};

export default React.memo(TaskSubTasksContainer);
