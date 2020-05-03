import { IBlock } from "../../../models/block/block";
import { getUserTaskCollaborator } from "../../../models/block/utils";
import * as blockNet from "../../../net/block";
import * as blockActions from "../../blocks/actions";
import { getSignedInUserRequired } from "../../session/selectors";
import store from "../../store";
import * as userActions from "../../users/actions";
import { pushOperation } from "../actions";
import {
  IOperationFuncOptions,
  isOperationStarted,
  operationStatusTypes,
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
    pushOperation(getTasksAssignedToUserOperationID, {
      scopeID: options.scopeID,
      status: operationStatusTypes.operationStarted,
      timestamp: Date.now(),
    })
  );

  try {
    const result = await blockNet.getTasksAssignedToUser();

    if (result && result.errors) {
      throw result.errors;
    }

    const { blocks: tasks } = result;
    const taskIDs = tasks.map((block) => block.customId);
    const user = getSignedInUserRequired(store.getState());

    store.dispatch(blockActions.bulkAddBlocksRedux(tasks));
    store.dispatch(
      userActions.updateUserRedux(
        user.customId,
        {
          assignedTasks: taskIDs,
        },
        { arrayUpdateStrategy: "replace" }
      )
    );

    store.dispatch(
      pushOperation(getTasksAssignedToUserOperationID, {
        scopeID: options.scopeID,
        status: operationStatusTypes.operationComplete,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    store.dispatch(
      pushOperation(getTasksAssignedToUserOperationID, {
        error,
        scopeID: options.scopeID,
        status: operationStatusTypes.operationError,
        timestamp: Date.now(),
      })
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
            assignedTasks: assignedTaskIDs,
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
            assignedTasks: assignedTaskIDs,
          },
          { arrayUpdateStrategy: "replace" }
        )
      );
    }
  }
}
