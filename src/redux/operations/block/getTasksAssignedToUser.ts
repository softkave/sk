import { Dispatch } from "redux";
import { IBlock } from "../../../models/block/block";
import { aggregateBlocksParentIDs } from "../../../models/block/utils";
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
    const transformedError = OperationError.fromAny(error);

    dispatchOperationError({ ...dispatchOptions, error: transformedError });
  }
}
