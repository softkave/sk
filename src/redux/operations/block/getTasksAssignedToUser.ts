import { Dispatch } from "redux";
import { IBlock } from "../../../models/block/block";
import {
  aggregateBlocksParentIDs,
  getUserTaskCollaborator
} from "../../../models/block/utils";
import * as blockNet from "../../../net/block";
import OperationError from "../../../utils/operation-error/OperationError";
import * as blockActions from "../../blocks/actions";
import { getSignedInUserRequired } from "../../session/selectors";
import { IReduxState } from "../../store";
import * as userActions from "../../users/actions";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  IDispatchOperationFuncProps,
  IOperationFuncOptions,
  isOperationStarted
} from "../operation";
import { getTasksAssignedToUserOperationID } from "../operationIDs";
import { getOperationsWithID } from "../selectors";

export default async function getTasksAssignedToUserOperationFunc(
  state: IReduxState,
  dispatch: Dispatch,
  dataProps: {} = {},
  options: IOperationFuncOptions = {}
) {
  const operations = getOperationsWithID(
    state,
    getTasksAssignedToUserOperationID
  );

  if (operations[0] && isOperationStarted(operations[0], options.scopeID)) {
    return;
  }

  const dispatchOptions: IDispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationID: getTasksAssignedToUserOperationID
  };

  dispatchOperationStarted(dispatchOptions);

  try {
    const result = await blockNet.getTasksAssignedToUser();

    if (result && result.errors) {
      console.log("Result has error");
      throw result.errors;
    }

    const { blocks: tasks } = result;
    const parentIDs = aggregateBlocksParentIDs(tasks);
    const maxFetchableBlocksPerRequest = 100;
    let parents: IBlock[] = [];

    // TODO: should we fetch only the parents we don't have yet?
    // TODO: should the getAssignedTasks API only return ids, so that we can fetch the ones we don't have yet?
    for (let i = 0; i < parentIDs.length; i += maxFetchableBlocksPerRequest) {
      const parentsResult = await blockNet.getBlocksWithCustomIDs({
        customIDs: parentIDs.slice(i, i + maxFetchableBlocksPerRequest)
      });

      if (parentsResult && parentsResult.errors) {
        console.log("Parents has error");
        throw parentsResult.errors;
      }

      parents = parents.concat(parentsResult.blocks);
    }

    const taskIDs = tasks.map(block => block.customId);
    const user = getSignedInUserRequired(state);

    dispatch(blockActions.bulkAddBlocksRedux(tasks.concat(parents)));
    dispatch(
      userActions.updateUserRedux(
        user.customId,
        {
          assignedTasks: taskIDs
        },
        { arrayUpdateStrategy: "replace" }
      )
    );

    dispatchOperationComplete(dispatchOptions);
  } catch (error) {
    console.log(error);
    const transformedError = OperationError.fromAny(error);

    dispatchOperationError({ ...dispatchOptions, error: transformedError });
  }
}

export function addTaskToUserIfAssigned(
  state: IReduxState,
  dispatch: Dispatch,
  block: IBlock
) {
  if (block.type === "task") {
    const user = getSignedInUserRequired(state);

    if (Array.isArray(user.assignedTasks)) {
      const assignedTaskIDs = [...user.assignedTasks];
      const isAssignedToUser = !!getUserTaskCollaborator(block, user);
      const taskIDIndex = assignedTaskIDs.indexOf(block.customId);

      if (isAssignedToUser) {
        if (taskIDIndex === -1) {
          assignedTaskIDs.push(block.customId);
        }
      } else {
        if (taskIDIndex !== -1) {
          assignedTaskIDs.splice(taskIDIndex, 1);
        }
      }

      dispatch(
        userActions.updateUserRedux(
          user.customId,
          {
            assignedTasks: assignedTaskIDs
          },
          { arrayUpdateStrategy: "replace" }
        )
      );
    }
  }
}

export function removeTaskFromUserIfAssigned(
  state: IReduxState,
  dispatch: Dispatch,
  block: IBlock
) {
  if (block.type === "task") {
    const user = getSignedInUserRequired(state);

    if (Array.isArray(user.assignedTasks)) {
      const assignedTaskIDs = [...user.assignedTasks];
      const taskIDIndex = assignedTaskIDs.indexOf(block.customId);

      if (taskIDIndex !== -1) {
        assignedTaskIDs.splice(taskIDIndex, 1);
      }

      dispatch(
        userActions.updateUserRedux(
          user.customId,
          {
            assignedTasks: assignedTaskIDs
          },
          { arrayUpdateStrategy: "replace" }
        )
      );
    }
  }
}
