import { Icon, Switch } from "antd";
import React from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { IBlock } from "../../models/block/block";
import {
  getTaskCompletionData,
  getUserTaskCollaborator
} from "../../models/block/utils";
import toggleTaskOperationFunc from "../../redux/operations/block/toggleTask";
import { toggleTaskOperationID } from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import useOperation from "../hooks/useOperation";
import Loading from "../Loading";
import StyledContainer from "../styled/Container";

const StyledIcon = StyledContainer.withComponent(Icon);

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
  // const userTaskCollaboratorData = getUserTaskCollaborator(task, user);
  // const taskCollaborators = task.taskCollaborators || [];
  const completionData = getTaskCompletionData(task, user);

  const renderUncheckedChildren = () => {
    // if (completionData.isCompeleted) {
    //   return null;
    // }

    if (completionData.type === "individual") {
      return `${completionData.hasCompleted} | ${completionData.total}`;
    }

    return null;
  };

  const renderUserHasCompletedMarker = () => {
    if (completionData.type === "individual") {
      if (completionData.userHasCompleted) {
        return (
          <Icon
            type="check-circle"
            theme="twoTone"
            style={{ color: "green", marginLeft: "4px", fontSize: "16px" }}
          />
        );
      }
    }
  };

  // const isTaskCompleted = () => {
  //   const collaborationType =
  //     task.taskCollaborationType!.collaborationType || "collective";

  //   if (collaborationType === "collective") {
  //     return !!task.taskCollaborationType!.completedAt;
  //   } else {
  //     const hasCompleted = taskCollaborators.filter(
  //       collaborator => !!collaborator.completedAt
  //     );
  //     return userTaskCollaboratorData && !!userTaskCollaboratorData.completedAt
  //       ? true
  //       : taskCollaborators.length === hasCompleted.length
  //       ? true
  //       : false;
  //   }
  // };

  const onToggle = () => {
    toggleTaskOperationFunc(store.getState(), dispatch, { user, block: task });
  };

  // if (toggleTaskOperation.isLoading) {
  //   return <Loading fontSize="16px" />;
  // }

  // const checked = isTaskCompleted();
  // const isUserAssigned = !!userTaskCollaboratorData;
  const l = renderUncheckedChildren();

  return (
    <StyledContainer s={{ alignItems: "center" }}>
      <Switch
        loading={toggleTaskOperation.isLoading}
        checked={completionData.isCompeleted}
        // checked={completionData.userHasCompleted || completionData.isCompeleted}
        onChange={onToggle}
        disabled={disabled || !completionData.userIsAssigned}
        unCheckedChildren={l}
        checkedChildren={l}
      />
      {renderUserHasCompletedMarker()}
    </StyledContainer>
  );
};

export default ToggleSwitch;
