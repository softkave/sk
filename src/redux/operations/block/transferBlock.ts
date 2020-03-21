import { BlockGroupContext, IBlock } from "../../../models/block/block";
import * as blockNet from "../../../net/block";
import OperationError from "../../../utils/operation-error/OperationError";
import reorder from "../../../utils/reorder";
import * as blockActions from "../../blocks/actions";
import { getBlock } from "../../blocks/selectors";
import store from "../../store";
import { pushOperation } from "../actions";
import {
  IOperationFuncOptions,
  isOperationStarted,
  operationStatusTypes
} from "../operation";
import { transferBlockOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";

export interface ITransferBlockProps {
  sourceBlockID: string;
  draggedBlockID: string;
  destinationBlockID: string;
  dropPosition?: number;
  groupContext?: BlockGroupContext;
}

export default async function transferBlockOperationFn(
  dataProps: ITransferBlockProps,
  options: IOperationFuncOptions = {}
) {
  const { sourceBlockID } = dataProps;
  const operation = getOperationWithIDForResource(
    store.getState(),
    transferBlockOperationID,
    sourceBlockID
  );

  if (operation && isOperationStarted(operation, options.scopeID)) {
    return;
  }

  store.dispatch(
    pushOperation(
      transferBlockOperationID,
      {
        scopeID: options.scopeID,
        status: operationStatusTypes.operationStarted,
        timestamp: Date.now()
      },
      sourceBlockID
    )
  );

  try {
    // const result = await blockNet.transferBlock(
    //   dataProps.sourceBlock,
    //   dataProps.draggedBlock,
    //   dataProps.destinationBlock,
    //   dataProps.dropPosition,
    //   dataProps.groupContext === "groupTaskContext" ? "task" : "project"
    // );

    // if (result && result.errors) {
    //   throw result.errors;
    // }

    transferBlockStateHelper(dataProps);

    store.dispatch(
      pushOperation(
        transferBlockOperationID,
        {
          scopeID: options.scopeID,
          status: operationStatusTypes.operationComplete,
          timestamp: Date.now()
        },
        sourceBlockID
      )
    );
  } catch (error) {
    const transformedError = OperationError.fromAny(error).transform({
      stripBaseNames: ["data"]
    });

    store.dispatch(
      pushOperation(
        transferBlockOperationID,
        {
          error: transformedError,
          scopeID: options.scopeID,
          status: operationStatusTypes.operationError,
          timestamp: Date.now()
        },
        sourceBlockID
      )
    );
  }
}

function updateBlockInStore(block: IBlock, updates: Partial<IBlock>) {
  store.dispatch(
    blockActions.updateBlockRedux(block.customId, updates, {
      arrayUpdateStrategy: "replace"
    })
  );
}

export function transferBlockStateHelper(props: ITransferBlockProps) {
  const sourceBlock = getBlock(store.getState(), props.sourceBlockID)!;
  const draggedBlock = getBlock(store.getState(), props.draggedBlockID)!;
  const destinationBlock = getBlock(
    store.getState(),
    props.destinationBlockID
  )!;
  const dropPosition = props.dropPosition || 0;
  const groupContext = props.groupContext;

  const containerName = `${draggedBlock.type}s`;
  const draggedBlockContainer: string[] = [...sourceBlock[containerName]];
  const draggedBlockIndexInSourceBlock = draggedBlockContainer.indexOf(
    draggedBlock.customId
  );

  if (draggedBlockIndexInSourceBlock === -1) {
    throw new Error("Dragged block not found in source block");
  }

  if (sourceBlock.customId === destinationBlock.customId) {
    if (!dropPosition) {
      // TODO: Find a way to differentiate between log errors and display errors
      throw new Error("Drop position not provided");
    }

    const sourceBlockUpdates: Partial<IBlock> = { updatedAt: Date.now() };

    sourceBlockUpdates[containerName] = reorder(
      draggedBlockContainer,
      draggedBlockIndexInSourceBlock,
      dropPosition
    );

    if (groupContext && draggedBlock.type === "group") {
      const groupContextContainer = sourceBlock[groupContext] || [];
      const draggedBlockIndexInGroupContext = groupContextContainer.indexOf(
        draggedBlock.customId
      );

      sourceBlockUpdates[groupContext] = reorder(
        groupContextContainer,
        draggedBlockIndexInGroupContext,
        dropPosition
      );
    }

    updateBlockInStore(sourceBlock, sourceBlockUpdates);
  } else {
    const draggedBlockUpdates: Partial<IBlock> = {
      updatedAt: Date.now(),
      parent: destinationBlock.customId
    };

    draggedBlockContainer.splice(draggedBlockIndexInSourceBlock, 1);

    const sourceBlockUpdates: Partial<IBlock> = {
      updatedAt: Date.now(),
      [containerName]: draggedBlockContainer
    };

    const destinationBlockContainer = [...destinationBlock[containerName]];

    destinationBlockContainer.splice(dropPosition, 0, draggedBlock.customId);

    const destinationBlockUpdates: Partial<IBlock> = {
      updatedAt: Date.now(),
      [containerName]: destinationBlockContainer
    };

    updateBlockInStore(sourceBlock, sourceBlockUpdates);
    updateBlockInStore(draggedBlock, draggedBlockUpdates);
    updateBlockInStore(destinationBlock, destinationBlockUpdates);
  }
}

export function hasBlockParentChanged(block: IBlock, update: IBlock) {
  return block.parent !== update.parent;
}
