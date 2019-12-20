import { Icon, Switch } from "antd";
import React from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { IBlock } from "../../models/block/block";
import { getTaskCompletionData } from "../../models/block/utils";
import toggleTaskOperationFunc from "../../redux/operations/block/toggleTask";
import { toggleTaskOperationID } from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import useOperation from "../hooks/useOperation";
import StyledContainer from "../styled/Container";

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
  const completionData = getTaskCompletionData(task, user);

  const renderUncheckedChildren = () => {
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

  const onToggle = () => {
    toggleTaskOperationFunc(store.getState(), dispatch, { user, block: task });
  };

  const renderedCompletionInformation = renderUncheckedChildren();

  return (
    <StyledContainer s={{ alignItems: "center" }}>
      <Switch
        loading={toggleTaskOperation.isLoading}
        checked={completionData.isCompeleted}
        onChange={onToggle}
        disabled={disabled}
        unCheckedChildren={renderedCompletionInformation}
        checkedChildren={renderedCompletionInformation}
      />
      {renderUserHasCompletedMarker()}
    </StyledContainer>
  );
};

export default ToggleSwitch;
