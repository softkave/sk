import { Dispatch } from "redux";
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
import { getBlocksWithCustomIDsOperationID } from "../operationIDs";
import { getOperationsWithID } from "../selectors";

export interface IGetBlocksParentsOperationFuncProps {
  customIDs: string[];
}

export default async function getBlocksParentsOperationFunc(
  state: IReduxState,
  dispatch: Dispatch,
  dataProps: IGetBlocksParentsOperationFuncProps,
  options: IOperationFuncOptions = {}
) {
  const operations = getOperationsWithID(
    state,
    getBlocksWithCustomIDsOperationID
  );

  if (operations[0] && isOperationStarted(operations[0], options.scopeID)) {
    return;
  }

  const dispatchOptions: IDispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationID: getBlocksWithCustomIDsOperationID
  };

  dispatchOperationStarted(dispatchOptions);

  try {
    const result = await blockNet.getBlocksWithCustomIDs(dataProps.customIDs);

    if (result && result.errors) {
      throw result.errors;
    }

    const { blocks } = result;

    dispatch(blockActions.bulkAddBlocksRedux(blocks));
    dispatchOperationComplete(dispatchOptions);
  } catch (error) {
    const transformedError = OperationError.fromAny(error);

    dispatchOperationError({ ...dispatchOptions, error: transformedError });
  }
}
