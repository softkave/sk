import { message, Switch } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { isTaskCompleted } from "../../models/block/utils";
import updateBlockOperationFunc from "../../redux/operations/block/updateBlock";
// import toggleTaskOperationFunc from "../../redux/operations/block/toggleTask";
import { toggleTaskOperationID } from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import OperationError from "../../utils/operation-error/OperationError";
import useOperation from "../hooks/useOperation";

export interface IToggleSwitchProps {
  task: IBlock;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<IToggleSwitchProps> = props => {
  const { disabled, task } = props;
  const user = useSelector(getSignedInUserRequired);
  const toggleTaskOperation = useOperation({
    operationID: toggleTaskOperationID,
    resourceID: task.customId
  });

  const [lastStatusTimestamp, setLastStatusTimestamp] = React.useState(
    Date.now()
  );
  const isCompeleted = !!task.taskCollaborationData!.completedAt;

  React.useEffect(() => {
    if (
      toggleTaskOperation.currentStatus &&
      toggleTaskOperation.currentStatus.timestamp >= lastStatusTimestamp
    ) {
      setLastStatusTimestamp(Date.now());
    }
  }, [setLastStatusTimestamp, lastStatusTimestamp, toggleTaskOperation]);

  if (
    toggleTaskOperation.isError &&
    toggleTaskOperation.currentStatus!.timestamp >= lastStatusTimestamp
  ) {
    const error = OperationError.fromAny(toggleTaskOperation.error);
    const flattenedError = error.flatten();
    message.error(flattenedError.error);
  }

  const onToggle = () => {
    // toggleTaskOperationFunc(store.getState(), dispatch, { user, block: task });
    const isCompleted = isTaskCompleted(task, user);
    updateBlockOperationFunc({
      block: task,
      data: {
        taskCollaborationData: {
          ...task.taskCollaborationData!,
          completedAt: isCompleted ? 0 : Date.now(),
          completedBy: user.customId
        }
      }
    });
  };

  return (
    <Switch
      loading={toggleTaskOperation.isLoading}
      checked={isCompeleted}
      onChange={onToggle}
      disabled={disabled}
    />
  );
};

export default ToggleSwitch;
