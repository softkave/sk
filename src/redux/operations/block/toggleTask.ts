import { IBlock, ITaskCollaborator } from "../../../models/block/block";
import {
  assignTask,
  getUserTaskCollaborator
} from "../../../models/block/utils";
import { IUser } from "../../../models/user/user";
import * as blockNet from "../../../net/block";
import OperationError from "../../../utils/operation-error/OperationError";
import * as blockActions from "../../blocks/actions";
import store from "../../store";
import { pushOperation } from "../actions";
import {
  defaultOperationStatusTypes,
  IOperationFuncOptions,
  isOperationStarted
} from "../operation";
import { toggleTaskOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";

export interface IToggleTaskOperationFuncDataProps {
  user: IUser;
  block: IBlock;
}

export default async function toggleTaskOperationFunc(
  dataProps: IToggleTaskOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { user, block } = dataProps;
  const operation = getOperationWithIDForResource(
    store.getState(),
    toggleTaskOperationID,
    block.customId
  );

  if (operation && isOperationStarted(operation, options.scopeID)) {
    return;
  }

  const taskCollaborator = getUserTaskCollaborator(block, user);

  if (!taskCollaborator) {
    return;
  }

  store.dispatch(
    pushOperation(
      toggleTaskOperationID,
      {
        scopeID: options.scopeID,
        status: defaultOperationStatusTypes.operationStarted,
        timestamp: Date.now()
      },
      options.resourceID
    )
  );

  try {
    const result = await blockNet.toggleTask({
      block,
      data: taskCollaborator.completedAt ? false : true
    });

    if (result && result.errors) {
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

    store.dispatch(
      blockActions.updateBlockRedux(
        block.customId,
        { taskCollaborators },
        { arrayUpdateStrategy: "replace" }
      )
    );

    store.dispatch(
      pushOperation(
        toggleTaskOperationID,
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
        toggleTaskOperationID,
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
