import { Dispatch } from "redux";
import { IBlock, ITaskCollaborator } from "../../../models/block/block";
import { assignTask, isTaskCompleted } from "../../../models/block/utils";
import { IUser } from "../../../models/user/user";
import * as blockNet from "../../../net/block";
import OperationError from "../../../utils/operation-error/OperationError";
import * as blockActions from "../../blocks/actions";
import { IReduxState } from "../../store";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  IDispatchOperationFuncProps,
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
  state: IReduxState,
  dispatch: Dispatch,
  dataProps: IToggleTaskOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { user, block } = dataProps;
  const operation = getOperationWithIDForResource(
    state,
    toggleTaskOperationID,
    block.customId
  );

  if (operation && isOperationStarted(operation, options.scopeID)) {
    return;
  }

  const dispatchOptions: IDispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationID: toggleTaskOperationID,
    resourceID: block.customId
  };

  dispatchOperationStarted(dispatchOptions);

  try {
    const isCompleted = isTaskCompleted(block, user);
    const result = await blockNet.toggleTask({
      block,
      data: isCompleted ? false : true
    });

    if (result && result.errors) {
      throw result.errors;
    }

    if (block.taskCollaborationType!.collaborationType === "individual") {
      const taskCollaborators = [...(block.taskCollaborators || [])];
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
    } else {
      dispatch(
        blockActions.updateBlockRedux(
          block.customId,
          {
            taskCollaborationType: {
              ...block.taskCollaborationType!,
              completedAt: isCompleted ? 0 : Date.now(),
              completedBy: user.customId
            }
          },
          { arrayUpdateStrategy: "replace" }
        )
      );
    }

    dispatchOperationComplete(dispatchOptions);
  } catch (error) {
    const transformedError = OperationError.fromAny(error);

    dispatchOperationError({ ...dispatchOptions, error: transformedError });
  }
}
