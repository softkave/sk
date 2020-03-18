import { IBlock } from "../../../models/block/block";
import * as blockNet from "../../../net/block";
import OperationError from "../../../utils/operation-error/OperationError";
import * as blockActions from "../../blocks/actions";
import store from "../../store";
import { pushOperation } from "../actions";
import {
  IOperationFuncOptions,
  isOperationStarted,
  operationStatusTypes
} from "../operation";
import { getBlockLandingPageOperationID } from "../operationIDs";
import { getOperationsWithID } from "../selectors";

export interface IGetBlockLandingPageOperationFuncProps {
  block: IBlock;
}

export default async function getBlockLandingPageOperationFunc(
  dataProps: IGetBlockLandingPageOperationFuncProps,
  options: IOperationFuncOptions = {}
) {
  const operations = getOperationsWithID(
    store.getState(),
    getBlockLandingPageOperationID
  );

  if (operations[0] && isOperationStarted(operations[0], options.scopeID)) {
    return;
  }

  store.dispatch(
    pushOperation(
      getBlockLandingPageOperationID,
      {
        scopeID: options.scopeID,
        status: operationStatusTypes.operationStarted,
        timestamp: Date.now()
      },
      dataProps.block.customId
    )
  );

  try {
    const result = await blockNet.getBlockLandingPage(dataProps.block.customId);

    if (result && result.errors) {
      throw result.errors;
    }

    store.dispatch(
      blockActions.updateBlockRedux(
        dataProps.block.customId,
        { landingPage: result.page },
        {}
      )
    );

    store.dispatch(
      pushOperation(
        getBlockLandingPageOperationID,
        {
          scopeID: options.scopeID,
          status: operationStatusTypes.operationComplete,
          timestamp: Date.now()
        },
        dataProps.block.customId
      )
    );
  } catch (error) {
    const transformedError = OperationError.fromAny(error);

    store.dispatch(
      pushOperation(
        getBlockLandingPageOperationID,
        {
          error: transformedError,
          scopeID: options.scopeID,
          status: operationStatusTypes.operationError,
          timestamp: Date.now()
        },
        dataProps.block.customId
      )
    );
  }
}
