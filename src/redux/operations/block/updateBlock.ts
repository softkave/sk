import moment from "moment";
import { Dispatch } from "redux";
import { IBlock } from "../../../models/block/block";
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
import { updateBlockOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";

export interface IUpdateBlockOperationFuncDataProps {
  block: IBlock;
  data: Partial<IBlock>;
}

export default async function updateBlockOperationFunc(
  state: IReduxState,
  dispatch: Dispatch,
  dataProps: IUpdateBlockOperationFuncDataProps,
  options: IOperationFuncOptions
) {
  const { block, data } = dataProps;
  const operation = getOperationWithIDForResource(
    state,
    updateBlockOperationID,
    block.customId
  );

  if (operation && isOperationStarted(operation, options.scopeID)) {
    return;
  }

  if (data.expectedEndAt && typeof data.expectedEndAt !== "number") {
    data.expectedEndAt = moment(data.expectedEndAt).valueOf();
  }

  const dispatchOptions: IDispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationID: updateBlockOperationID,
    resourceID: block.customId
  };

  dispatchOperationStarted(dispatchOptions);

  try {
    const result = await blockNet.updateBlock({ block, data });

    if (result && result.errors) {
      throw result.errors;
    }

    dispatch(
      blockActions.updateBlockRedux(block.customId, data, {
        arrayUpdateStrategy: "replace"
      })
    );

    dispatchOperationComplete(dispatchOptions);
  } catch (error) {
    const transformedError = OperationError.fromAny(error).transform({
      stripBaseNames: ["data"]
    });

    dispatchOperationError({ ...dispatchOptions, error: transformedError });
  }
}
