import { Dispatch } from "redux";
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

    const { blocks } = result;
    const blockIDs = blocks.map(block => block.customId);
    const user = getSignedInUserRequired(state);

    dispatch(blockActions.bulkAddBlocksRedux(blocks));
    dispatch(
      userActions.updateUserRedux(
        user.customId,
        {
          assignedTasks: blockIDs
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
