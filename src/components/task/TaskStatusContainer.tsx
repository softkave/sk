import { LoadingOutlined } from "@ant-design/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IBlock, IBlockStatus } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import BlockSelectors from "../../redux/blocks/selectors";
import { updateBlockOperationAction } from "../../redux/operations/block/updateBlock";
import SessionSelectors from "../../redux/session/selectors";
import { AppDispatch, IAppState } from "../../redux/types";
import { getDateString } from "../../utils/utils";
import useOperation, { getOperationStats } from "../hooks/useOperation";
import TaskStatus from "./TaskStatus";

export interface ITaskStatusContainerProps {
  task: IBlock;

  demo?: boolean;
  statusList?: IBlockStatus[];
  className?: string;
}

// TODO: should we make updates locally first before persisting it in the server for better UX?
// and for client-side only work

const TaskStatusContainer: React.FC<ITaskStatusContainerProps> = (props) => {
  const { task, className, demo } = props;
  const dispatch: AppDispatch = useDispatch();
  const operation = useOperation();

  const user = useSelector<IAppState, IUser>((state) => {
    if (demo) {
      return ({} as unknown) as IUser;
    }

    return SessionSelectors.getSignedInUserRequired(state);
  });

  const statusList = useSelector<IAppState, IBlockStatus[]>((state) => {
    return (
      props.statusList ||
      BlockSelectors.getBlock(state, task.parent!)?.boardStatuses ||
      []
    );
  });

  if (operation.isLoading) {
    return <LoadingOutlined />;
  }

  return (
    <TaskStatus
      className={className}
      statusList={statusList}
      statusId={task.status}
      onChange={async (value) => {
        if (demo) {
          return;
        }

        const result = await dispatch(
          updateBlockOperationAction({
            opId: operation.opId,
            block: task,
            data: {
              status: value,
              statusAssignedAt: getDateString(),
              statusAssignedBy: user.customId,
            },
          })
        );

        const op = unwrapResult(result);

        if (!op) {
          return;
        }

        const opStat = getOperationStats(op);

        if (opStat.isError) {
          message.error("Error changing task status");
        }
      }}
    />
  );
};

export default React.memo(TaskStatusContainer);
