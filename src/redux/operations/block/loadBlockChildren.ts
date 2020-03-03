import { BlockType, IBlock } from "../../../models/block/block";
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
import { getBlockChildrenOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";
import updateBlockOperationFunc from "./updateBlock";

export interface ILoadBlockChildrenOperationFuncDataProps {
  block: IBlock;
  typeList?: BlockType[];
}

export default async function loadBlockChildrenOperationFunc(
  dataProps: ILoadBlockChildrenOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { block, typeList } = dataProps;
  const operation = getOperationWithIDForResource(
    store.getState(),
    getBlockChildrenOperationID,
    block.customId
  );

  if (operation && isOperationStarted(operation)) {
    return;
  }

  store.dispatch(
    pushOperation(
      getBlockChildrenOperationID,
      {
        scopeID: options.scopeID,
        status: operationStatusTypes.operationStarted,
        timestamp: Date.now()
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

    // TODO: this list should be based on the valid chidren types
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

    store.dispatch(blockActions.bulkAddBlocksRedux(blocks));

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
        updateBlockOperationFunc({ block, data: parentUpdate }, options);

        store.dispatch(
          blockActions.updateBlockRedux(block.customId, parentUpdate, {
            arrayUpdateStrategy: "replace"
          })
        );

        break;
      }
    }

    store.dispatch(
      pushOperation(
        getBlockChildrenOperationID,
        {
          scopeID: options.scopeID,
          status: operationStatusTypes.operationComplete,
          timestamp: Date.now()
        },
        block.customId
      )
    );
  } catch (error) {
    const transformedError = OperationError.fromAny(error);

    store.dispatch(
      pushOperation(
        getBlockChildrenOperationID,
        {
          error: transformedError,
          scopeID: options.scopeID,
          status: operationStatusTypes.operationError,
          timestamp: Date.now()
        },
        block.customId
      )
    );
  }
}
