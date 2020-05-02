import { LoadingOutlined } from "@ant-design/icons";
import { message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { IBlock } from "../../models/block/block";
import { pushOperation } from "../../redux/operations/actions";
import updateBlockOperationFunc from "../../redux/operations/block/updateBlock";
import { operationStatusTypes } from "../../redux/operations/operation";
import { updateBlockOperationID } from "../../redux/operations/operationIDs";
import useOperation from "../hooks/useOperation";
import TaskStatus from "./TaskStatus";

const scopeID = "TaskStatusContainer";

export interface ITaskStatusContainerProps {
  task: IBlock;
}

// TODO: should we make updates locally first before persisting it in the server for better UX?
// and for client-side only work

const TaskStatusContainer: React.FC<ITaskStatusContainerProps> = (props) => {
  const { task } = props;
  const dispatch = useDispatch();
  const operation = useOperation({
    scopeID,
    operationID: updateBlockOperationID,
    resourceID: task.customId,
  });

  React.useEffect(() => {
    if (operation.error) {
      message.error("Error updating task status");
      dispatch(
        pushOperation(
          updateBlockOperationID,
          {
            scopeID,
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
      orgID={task.rootBlockID!}
      statusID={task.status}
      onChange={(value) => {
        updateBlockOperationFunc(
          { block: task, data: { status: value } },
          { scopeID, resourceID: task.customId }
        );
      }}
    />
  );
};

export default React.memo(TaskStatusContainer);
