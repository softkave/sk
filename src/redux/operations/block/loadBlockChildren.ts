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
import { getBlockChildrenOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";
import updateBlockOperationFunc from "./updateBlock";

export interface ILoadBlockChildrenOperationFuncDataProps {
  block: IBlock;
  types?: string[];
  isBacklog?: boolean;
}

export default async function loadBlockChildrenOperationFunc(
  state: IReduxState,
  dispatch: Dispatch,
  dataProps: ILoadBlockChildrenOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { block, isBacklog, types } = dataProps;
  const operation = getOperationWithIDForResource(
    state,
    getBlockChildrenOperationID,
    block.customId
  );

  if (operation && isOperationStarted(operation)) {
    return;
  }

  const dispatchOptions: IDispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationID: getBlockChildrenOperationID,
    resourceID: block.customId
  };

  dispatchOperationStarted(dispatchOptions);

  try {
    const result = await blockNet.getBlockChildren({
      block,
      types,
      isBacklog
    });

    if (result && result.errors) {
      throw result.errors;
    }

    const { blocks } = result;
    const parentUpdate: Partial<IBlock> = {
      tasks: [],
      groups: [],
      projects: [],
      groupTaskContext: [],
      groupProjectContext: []
    };

    blocks.forEach(nextBlock => {
      const container = parentUpdate[`${nextBlock.type}s`];
      container.push(nextBlock.customId);

      if (nextBlock.type === "group") {
        parentUpdate.groupTaskContext!.push(nextBlock.customId);
        parentUpdate.groupProjectContext!.push(nextBlock.customId);
      }
    });

    dispatch(blockActions.bulkAddBlocksRedux(blocks));

    // tslint:disable-next-line: forin
    for (const key in parentUpdate) {
      const typeContainer = parentUpdate[key];

      // To update children customIds if not present or some are missing
      // { tasks: [], ... }
      if (
        !Array.isArray(block[key]) ||
        block[key].length !== typeContainer.length
      ) {
        // TODO: Think on, this is currently fire and forget, should we wait for it?
        updateBlockOperationFunc(
          state,
          dispatch,
          { block, data: parentUpdate },
          options
        );

        dispatch(
          blockActions.updateBlockRedux(block.customId, parentUpdate, {
            arrayUpdateStrategy: "replace"
          })
        );

        break;
      }
    }

    dispatchOperationComplete(dispatchOptions);
  } catch (error) {
    const transformedError = OperationError.fromAny(error);

    dispatchOperationError({ ...dispatchOptions, error: transformedError });
  }
}
