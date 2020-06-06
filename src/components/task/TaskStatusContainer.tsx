import { LoadingOutlined } from "@ant-design/icons";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { pushOperation } from "../../redux/operations/actions";
import updateBlockOperationFunc from "../../redux/operations/block/updateBlock";
import { operationStatusTypes } from "../../redux/operations/operation";
import { updateBlockOperationId } from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { getDateString } from "../../utils/utils";
import useOperation from "../hooks/useOperation";
import TaskStatus from "./TaskStatus";

const scopeId = "TaskStatusContainer";

export interface ITaskStatusContainerProps {
  task: IBlock;

  className?: string;
}

// TODO: should we make updates locally first before persisting it in the server for better UX?
// and for client-side only work

const TaskStatusContainer: React.FC<ITaskStatusContainerProps> = (props) => {
  const { task, className } = props;
  const dispatch = useDispatch();
  const operation = useOperation({
    scopeId,
    operationId: updateBlockOperationId,
    resourceId: task.customId,
  });

  const user = useSelector(getSignedInUserRequired);

  React.useEffect(() => {
    if (operation.error) {
      message.error("Error updating task status");
      dispatch(
        pushOperation(
          updateBlockOperationId,
          {
            scopeId,
            status: operationStatusTypes.consumed,
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
      orgId={task.rootBlockId!}
      statusId={task.status}
      onChange={(value) => {
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
