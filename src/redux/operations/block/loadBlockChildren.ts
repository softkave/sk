import { BlockType, IBlock } from "../../../models/block/block";
import * as blockNet from "../../../net/block";
import * as blockActions from "../../blocks/actions";
import store from "../../store";
import { pushOperation } from "../actions";
import {
  IOperationFuncOptions,
  isOperationStarted,
  operationStatusTypes,
} from "../operation";
import { getOperationWithIdForResource } from "../selectors";

export interface ILoadBlockChildrenOperationFuncDataProps {
  block: IBlock;
  operationId: string;
  typeList?: BlockType[];
}

export default async function loadBlockChildrenOperationFunc(
  dataProps: ILoadBlockChildrenOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { block, typeList, operationId } = dataProps;
  const operation = getOperationWithIdForResource(
    store.getState(),
    operationId,
    block.customId
  );

  if (operation && isOperationStarted(operation)) {
    return;
  }

  store.dispatch(
    pushOperation(
      operationId,
      {
        scopeId: options.scopeId,
        status: operationStatusTypes.operationStarted,
        timestamp: Date.now(),
      },
      block.customId
    )
  );

  try {
    const result = await blockNet.getBlockChildren(block, typeList);

    if (result && result.errors) {
      throw result.errors;
    }

    const { blocks } = result;
    store.dispatch(blockActions.bulkAddBlocksRedux(blocks));

    // TODO: this list should be based on the valid chidren types
    const parentUpdate: Partial<IBlock> = {
      tasks: [],
      boards: [],
    };

    blocks.forEach((nextBlock) => {
      const container = parentUpdate[`${nextBlock.type}s`];
      container.push(nextBlock.customId);
    });

    // tslint:disable-next-line: forin
    for (const key in parentUpdate) {
      const typeContainer = parentUpdate[key];

      if (
        !Array.isArray(block[key]) ||
        block[key].length !== typeContainer.length
      ) {
        store.dispatch(
          blockActions.updateBlockRedux(block.customId, parentUpdate, {
            arrayUpdateStrategy: "replace",
          })
        );

        break;
      }
    }

    store.dispatch(
      pushOperation(
        operationId,
        {
          scopeId: options.scopeId,
          status: operationStatusTypes.operationComplete,
          timestamp: Date.now(),
        },
        block.customId
      )
    );
  } catch (error) {
    store.dispatch(
      pushOperation(
        operationId,
        {
          error,
          scopeId: options.scopeId,
          status: operationStatusTypes.operationError,
          timestamp: Date.now(),
        },
        block.customId
      )
    );
  }
}
