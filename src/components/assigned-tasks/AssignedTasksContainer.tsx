import { connect } from "react-redux";
import { Dispatch } from "redux";
import { aggregateBlocksParentIDs } from "../../models/block/utils";
import { getBlocksAsArray } from "../../redux/blocks/selectors";
import getTasksAssignedToUserOperationFunc from "../../redux/operations/block/getTasksAssignedToUser";
import {
  getOperationLastError,
  isOperationCompleted,
  isOperationError,
  isOperationPending,
  isOperationStarted
} from "../../redux/operations/operation";
import { getTasksAssignedToUserOperationID } from "../../redux/operations/operationIDs";
import { getFirstOperationWithID } from "../../redux/operations/selectors";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import { getBlockMethods } from "../block/methods";
import AssignedTasks from "./AssignedTasks";

function mapStateToProps(state: IReduxState) {
  return state;
}

function mapDispatchToProps(dispatch: Dispatch) {
  return { dispatch };
}

function getAssignedTasksAndParents(state: IReduxState) {
  const user = getSignedInUserRequired(state);

  if (Array.isArray(user.assignedTasks)) {
    const tasks = getBlocksAsArray(state, user.assignedTasks);

    if (tasks.length === user.assignedTasks.length) {
      const parentIDs = aggregateBlocksParentIDs(tasks);
      const parents = getBlocksAsArray(state, parentIDs);

      if (parentIDs.length === parents.length) {
        return { tasks, parents };
      }
    }
  }

  return { tasks: undefined, parents: undefined };
}

function mergeProps(state: IReduxState, { dispatch }: { dispatch: Dispatch }) {
  const user = getSignedInUserRequired(state);
  const blockHandlers = getBlockMethods(state, dispatch);
  const operation = getFirstOperationWithID(
    state,
    getTasksAssignedToUserOperationID
  );
  const isDataLoading =
    isOperationStarted(operation) || isOperationPending(operation);
  const isDataLoaded = isOperationCompleted(operation);
  const error = isOperationError(operation)
    ? getOperationLastError(operation)
    : undefined;
  const data = isDataLoaded ? getAssignedTasksAndParents(state) : undefined;
  const fetchAssignedTasksAndParents = () =>
    getTasksAssignedToUserOperationFunc(state, dispatch);

  return {
    error,
    user,
    blockHandlers,
    fetchAssignedTasksAndParents,
    isDataLoaded,
    isDataLoading,
    tasks: data ? data.tasks : undefined,
    parents: data ? data.parents : undefined
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(AssignedTasks);
