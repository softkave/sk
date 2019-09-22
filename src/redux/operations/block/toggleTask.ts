import { Dispatch } from "redux";

import { IBlock, ITaskCollaborator } from "../../../models/block/block";
import { assignTask } from "../../../models/block/utils";
import { IUser } from "../../../models/user/user";
import * as blockNet from "../../../net/block";
import * as blockActions from "../../blocks/actions";
import { IReduxState } from "../../store";
import { transformError } from "../error";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  isOperationStarted
} from "../operation";
import { toggleTaskOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";

export default async function toggleTaskOperation(
  state: IReduxState,
  dispatch: Dispatch,
  user: IUser,
  block: IBlock
) {
  function findTaskCollaborator(
    taskCollaborators: ITaskCollaborator[],
    userId: string
  ) {
    const collaboratorIndex = taskCollaborators.findIndex(
      c => c.userId === userId
    );

    return taskCollaborators[collaboratorIndex];
  }

  const operation = getOperationWithIDForResource(
    state,
    toggleTaskOperationID,
    block.customId
  );

  if (operation && isOperationStarted(operation)) {
    return;
  }

  dispatchOperationStarted(dispatch, toggleTaskOperationID, block.customId);

  try {
    const taskCollaborator = findTaskCollaborator(
      block.taskCollaborators,
      user.customId
    );

    const result = await blockNet.toggleTask({
      block,
      data: taskCollaborator.completedAt ? false : true
    });

    if (result.errors) {
      throw result.errors;
    }

    const taskCollaborators = [...block.taskCollaborators];
    const collaboratorIndex = taskCollaborators.findIndex(
      c => c.userId === user.customId
    );

    let collaborator: ITaskCollaborator;

    if (collaboratorIndex !== -1) {
      collaborator = { ...taskCollaborators[collaboratorIndex] };
      collaborator.completedAt = collaborator.completedAt
        ? undefined
        : Date.now();

      taskCollaborators[collaboratorIndex] = collaborator;
    } else {
      collaborator = assignTask(user);
      collaborator.completedAt = Date.now();
      taskCollaborators.push(collaborator);
    }

    dispatch(
      blockActions.updateBlockRedux(
        block.customId,
        { taskCollaborators },
        { arrayUpdateStrategy: "replace" }
      )
    );

    dispatchOperationComplete(dispatch, toggleTaskOperationID);
  } catch (error) {
    const transformedError = transformError(error);
    dispatchOperationError(
      dispatch,
      toggleTaskOperationID,
      null,
      transformedError
    );
  }
}
