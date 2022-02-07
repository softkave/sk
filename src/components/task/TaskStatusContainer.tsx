import { LoadingOutlined } from "@ant-design/icons/lib/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import {
  IBlockStatus,
  IBoardTaskResolution,
  IFormBlock,
} from "../../models/block/block";
import { ITask } from "../../models/task/types";
import { updateTaskOpAction } from "../../redux/operations/task/updateTask";
import { AppDispatch } from "../../redux/types";
import { getOpData } from "../hooks/useOperation";
import TaskStatus from "./TaskStatus";

export interface ITaskStatusContainerProps {
  task: ITask;
  statusList: IBlockStatus[];
  resolutionsList: IBoardTaskResolution[];
  statusMap: { [key: string]: IBlockStatus };
  resolutionsMap: { [key: string]: IBoardTaskResolution };
  onSelectAddNewStatus: () => void;
  onSelectAddNewResolution: () => void;
  demo?: boolean;
  className?: string;
}

const TaskStatusContainer: React.FC<ITaskStatusContainerProps> = (props) => {
  const { task, demo, statusList } = props;
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch: AppDispatch = useDispatch();
  const onChangeStatus = React.useCallback(
    async (statusId: string, resolutionId?: string) => {
      if (demo) {
        return;
      }

      setIsLoading(true);
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
        updateTaskOpAction({
          taskId: task.customId,
          data: update,
          deleteOpOnComplete: true,
        })
      );

      const op = unwrapResult(result);

      if (op) {
        const opData = getOpData(op);

        if (opData.isError) {
          message.error("Error updating task status.");
        }
      }

      setIsLoading(false);
    },
    [demo, dispatch, statusList, task.customId, task.taskResolution]
  );

  const onChangeResolution = React.useCallback(
    async (value) => {
      if (demo) {
        return;
      }

      setIsLoading(true);
      const result = await dispatch(
        updateTaskOpAction({
          taskId: task.customId,
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
          message.error("Error updating task resolution.");
        }
      }

      setIsLoading(false);
    },
    [demo, dispatch, task.customId]
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
