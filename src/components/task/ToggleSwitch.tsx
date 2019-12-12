import { Switch } from "antd";
import React from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { IBlock } from "../../models/block/block";
import { getUserTaskCollaborator } from "../../models/block/utils";
import toggleTaskOperationFunc from "../../redux/operations/block/toggleTask";
import { toggleTaskOperationID } from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import useOperation from "../hooks/useOperation";
import Loading from "../Loading";

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
  const userTaskCollaboratorData = getUserTaskCollaborator(task, user);
  const checked =
    userTaskCollaboratorData && !!userTaskCollaboratorData.completedAt
      ? true
      : false;

  const onToggle = () => {
    toggleTaskOperationFunc(store.getState(), dispatch, { user, block: task });
  };

  if (toggleTaskOperation.isLoading) {
    return <Loading fontSize="16px" />;
  }

  return <Switch checked={checked} onChange={onToggle} disabled={disabled} />;
};

export default ToggleSwitch;
