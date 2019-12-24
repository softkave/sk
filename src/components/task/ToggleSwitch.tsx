import { message, Switch } from "antd";
import React from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { IBlock } from "../../models/block/block";
import toggleTaskOperationFunc from "../../redux/operations/block/toggleTask";
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
  const store = useStore();
  const dispatch = useDispatch();
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
  });

  if (
    toggleTaskOperation.isError &&
    toggleTaskOperation.currentStatus!.timestamp >= lastStatusTimestamp
  ) {
    const error = OperationError.fromAny(toggleTaskOperation.error);
    const flattenedError = error.flatten();
    message.error(flattenedError.error);
  }

  const onToggle = () => {
    toggleTaskOperationFunc(store.getState(), dispatch, { user, block: task });
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
