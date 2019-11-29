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
import store, { IReduxState } from "../../store";
import * as userActions from "../../users/actions";
import { pushOperation } from "../actions";
import {
  defaultOperationStatusTypes,
  IOperationFuncOptions,
  isOperationStarted
} from "../operation";
import { getTasksAssignedToUserOperationID } from "../operationIDs";
import { getFirstOperationWithID } from "../selectors";

export default async function getTasksAssignedToUserOperationFunc(
  dataProps: {} = {},
  options: IOperationFuncOptions = {}
) {
  const operation = getFirstOperationWithID(
    store.getState(),
    getTasksAssignedToUserOperationID
  );

  if (operation && isOperationStarted(operation, options.scopeID)) {
    return;
  }

  store.dispatch(
    pushOperation(
      getTasksAssignedToUserOperationID,
      {
        scopeID: options.scopeID,
        status: defaultOperationStatusTypes.operationStarted,
        timestamp: Date.now()
      },
      options.resourceID
    )
  );

  try {
    const result = await blockNet.getTasksAssignedToUser();

    if (result && result.errors) {
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
        throw parentsResult.errors;
      }

      parents = parents.concat(parentsResult.blocks);
    }

    const taskIDs = tasks.map(block => block.customId);
    const user = getSignedInUserRequired(store.getState());

    store.dispatch(blockActions.bulkAddBlocksRedux(tasks.concat(parents)));
    store.dispatch(
      userActions.updateUserRedux(
        user.customId,
        {
          assignedTasks: taskIDs
        },
        { arrayUpdateStrategy: "replace" }
      )
    );

    store.dispatch(
      pushOperation(
        getTasksAssignedToUserOperationID,
        {
          scopeID: options.scopeID,
          status: defaultOperationStatusTypes.operationComplete,
          timestamp: Date.now()
        },
        options.resourceID
      )
    );
  } catch (error) {
    const transformedError = OperationError.fromAny(error);

    store.dispatch(
      pushOperation(
        getTasksAssignedToUserOperationID,
        {
          error: transformedError,
          scopeID: options.scopeID,
          status: defaultOperationStatusTypes.operationComplete,
          timestamp: Date.now()
        },
        options.resourceID
      )
    );
  }
}

export function addTaskToUserIfAssigned(block: IBlock) {
  if (block.type === "task") {
    const user = getSignedInUserRequired(store.getState());

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

      store.dispatch(
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

export function removeTaskFromUserIfAssigned(block: IBlock) {
  if (block.type === "task") {
    const user = getSignedInUserRequired(store.getState());

    if (Array.isArray(user.assignedTasks)) {
      const assignedTaskIDs = [...user.assignedTasks];
      const taskIDIndex = assignedTaskIDs.indexOf(block.customId);

      if (taskIDIndex !== -1) {
        assignedTaskIDs.splice(taskIDIndex, 1);
      }

      store.dispatch(
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
