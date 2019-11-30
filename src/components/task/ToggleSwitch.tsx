import { Switch } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { getUserTaskCollaborator } from "../../models/block/utils";
import toggleTaskOperationFunc from "../../redux/operations/block/toggleTask";
import { toggleTaskOperationID } from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import Loading from "../Loading";
import OH, { IOHDerivedProps } from "../utils/OH";

export interface IToggleSwitchProps {
  task: IBlock;
  disabled?: boolean;
}

const ToggleSwitch: React.SFC<IToggleSwitchProps> = props => {
  const { disabled, task } = props;
  const user = useSelector(getSignedInUserRequired);
  const userTaskCollaboratorData = getUserTaskCollaborator(task, user);
  const checked =
    userTaskCollaboratorData && !!userTaskCollaboratorData.completedAt
      ? true
      : false;

  const onToggle = () => {
    toggleTaskOperationFunc({ user, block: task });
  };

  const render = (opProps: IOHDerivedProps) => {
    if (
      opProps.isLoading ||
      opProps.operation === undefined ||
      opProps.operation === null
    ) {
      return <Loading />;
    }

    return <Switch checked={checked} onChange={onToggle} disabled={disabled} />;
  };

  return (
    <OH dontManageRender operationID={toggleTaskOperationID} render={render} />
  );
};

export default ToggleSwitch;
