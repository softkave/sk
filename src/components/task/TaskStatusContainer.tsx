import { LoadingOutlined } from "@ant-design/icons";
import { message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { IBlock } from "../../models/block/block";
import { pushOperation } from "../../redux/operations/actions";
import updateBlockOperationFunc from "../../redux/operations/block/updateBlock";
import { operationStatusTypes } from "../../redux/operations/operation";
import { updateBlockOperationId } from "../../redux/operations/operationIds";
import useOperation from "../hooks/useOperation";
import TaskStatus from "./TaskStatus";

const scopeId = "TaskStatusContainer";

export interface ITaskStatusContainerProps {
  task: IBlock;
}

// TODO: should we make updates locally first before persisting it in the server for better UX?
// and for client-side only work

const TaskStatusContainer: React.FC<ITaskStatusContainerProps> = (props) => {
  const { task } = props;
  const dispatch = useDispatch();
  const operation = useOperation({
    scopeId: scopeId,
    operationId: updateBlockOperationId,
    resourceId: task.customId,
  });

  React.useEffect(() => {
    if (operation.error) {
      message.error("Error updating task status");
      dispatch(
        pushOperation(
          updateBlockOperationId,
          {
            scopeId: scopeId,
            status: operationStatusTypes.operationComplete,
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
      orgId={task.rootBlockId!}
      statusId={task.status}
      onChange={(value) => {
        updateBlockOperationFunc(
          { block: task, data: { status: value } },
          { scopeId: scopeId, resourceId: task.customId }
        );
      }}
    />
  );
};

export default React.memo(TaskStatusContainer);
