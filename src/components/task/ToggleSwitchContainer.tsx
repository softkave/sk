import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IBlock } from "../../models/block/block";
import { toggleTaskOperationID } from "../../redux/operations/operationIDs";
import { getOperationWithIDForResource } from "../../redux/operations/selectors";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import { getBlockMethods } from "../block/methods";
import getViewFromOperations from "../view/getViewFromOperations";
import ToggleSwitchViewManager from "./ToggleSwitchViewManager";

function mapStateToProps(state: IReduxState) {
  return state;
}

function mapDispatchToProps(dispatch: Dispatch) {
  return { dispatch };
}

export interface IToggleSwitchContainerProps {
  task: IBlock;
}

function mergeProps(
  state,
  { dispatch }: { dispatch: Dispatch },
  ownProps: IToggleSwitchContainerProps
) {
  const task = ownProps.task;
  const user = getSignedInUserRequired(state);
  const toggleSwitchOperation = getOperationWithIDForResource(
    state,
    toggleTaskOperationID,
    task.customId
  );

  const view = getViewFromOperations([toggleSwitchOperation], {
    viewName: "ready"
  });
  const taskCollaborator = Array.isArray(task.taskCollaborators)
    ? task.taskCollaborators.find(item => {
        return item.userId === user.customId;
      })
    : null;

  const checked =
    taskCollaborator && !!taskCollaborator.completedAt ? true : false;

  const blockHandlers = getBlockMethods(state, dispatch);
  // console.log({ toggleSwitchOperation, view, task, taskCollaborator });

  return {
    currentView: view,
    readyProps: {
      task,
      checked,
      disabled: !taskCollaborator,
      onToggle() {
        return blockHandlers.onToggle(user, task);
      }
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ToggleSwitchViewManager);
