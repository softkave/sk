import { LoadingOutlined } from "@ant-design/icons";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IBlock, IBlockStatus } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { getBlock } from "../../redux/blocks/selectors";
import { pushOperation } from "../../redux/operations/actions";
import updateBlockOperationFunc from "../../redux/operations/block/updateBlock";
import { OperationStatus } from "../../redux/operations/operation";
import { OperationIds.updateBlock } from "../../redux/operations/opc";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IAppState } from "../../redux/store";
import { getDateString } from "../../utils/utils";
import useOperation from "../hooks/useOperation";
import TaskStatus from "./TaskStatus";

const scopeId = "TaskStatusContainer";

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
  const dispatch = useDispatch();
  const operation = useOperation({
    scopeId,
    operationId: OperationIds.updateBlock,
    resourceId: task.customId,
  });

  const user = useSelector<IAppState, IUser>((state) => {
    if (demo) {
      return ({} as unknown) as IUser;
    }

    return getSignedInUserRequired(state);
  });

  const statusList = useSelector<IAppState, IBlockStatus[]>((state) => {
    return (
      props.statusList || getBlock(state, task.parent)!.boardStatuses || []
    );
  });

  React.useEffect(() => {
    if (operation.error) {
      message.error("Error updating task status");
      dispatch(
        pushOperation(
          OperationIds.updateBlock,
          {
            scopeId,
            status: OperationStatus.consumed,
            timestamp: Date.now(),
          },
          task.customId
        )
      );
    }
  });

  if (operation.isLoading) {
    return <LoadingOutlined />;
  }

  return (
    <TaskStatus
      className={className}
      statusList={statusList}
      statusId={task.status}
      onChange={(value) => {
        if (demo) {
          return;
        }

        updateBlockOperationFunc(
          {
            block: task,
            data: {
              status: value,
              statusAssignedAt: getDateString(),
              statusAssignedBy: user.customId,
            },
          },
          { scopeId, resourceId: task.customId }
        );
      }}
    />
  );
};

export default React.memo(TaskStatusContainer);
