import { BlockType, IBlock } from "../../../models/block/block";
import * as blockNet from "../../../net/block";
import * as blockActions from "../../blocks/actions";
import store from "../../store";
import { pushOperation } from "../actions";
import {
  IOperationFuncOptions,
  isOperationStarted,
  OperationStatus,
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
        status: OperationStatus.Started,
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

    const boards: string[] = [];

    blocks.forEach((nextBlock) => {
      if (nextBlock.type === BlockType.Board) {
        boards.push(nextBlock.customId);
      }
    });

    if (boards.length > 0) {
      store.dispatch(
        blockActions.updateBlockRedux(
          block.customId,
          { boards },
          {
            arrayUpdateStrategy: "replace",
          }
        )
      );
    }

    store.dispatch(
      pushOperation(
        operationId,
        {
          scopeId: options.scopeId,
          status: OperationStatus.Completed,
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
          status: OperationStatus.Error,
          timestamp: Date.now(),
        },
        block.customId
      )
    );
  }
}
