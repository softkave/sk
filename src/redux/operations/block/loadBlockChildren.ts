import { Dispatch } from "redux";
import { IBlock } from "../../../models/block/block";
import * as blockNet from "../../../net/block";
import * as blockActions from "../../blocks/actions";
import { IReduxState } from "../../store";
import { transformError } from "../error";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted
} from "../operation";
import { getBlockChildrenOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";
import updateBlockOperation from "./updateBlock";

export default async function loadBlockChildrenOperation(
  state: IReduxState,
  dispatch: Dispatch,
  block: IBlock,
  types?: string[],
  isBacklog?: boolean
) {
  const operation = getOperationWithIDForResource(
    state,
    getBlockChildrenOperationID,
    block.customId
  );

  if (
    operation
    // && isOperationStarted(operation)
  ) {
    return;
  }

  dispatchOperationStarted(
    dispatch,
    getBlockChildrenOperationID,
    block.customId
  );

  try {
    const result = await blockNet.getBlockChildren({
      block,
      types,
      isBacklog
    });

    if (result.errors) {
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

      if (
        !Array.isArray(block[key]) ||
        block[key].length !== typeContainer.length
      ) {
        // TODO: Think on, this is currently fire and forget
        updateBlockOperation(state, dispatch, block, parentUpdate);
        dispatch(
          blockActions.updateBlockRedux(block.customId, parentUpdate, {
            arrayUpdateStrategy: "replace"
          })
        );

        break;
      }
    }

    dispatchOperationComplete(
      dispatch,
      getBlockChildrenOperationID,
      block.customId
    );
  } catch (error) {
    const transformedError = transformError(error);
    dispatchOperationError(
      dispatch,
      getBlockChildrenOperationID,
      block.customId,
      transformedError
    );
  }
}
