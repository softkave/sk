import { IBlock } from "../../../models/block/block";
import reorder from "../../../utils/reorder";
import { getDateString } from "../../../utils/utils";
import * as blockActions from "../../blocks/actions";
import { getBlock } from "../../blocks/selectors";
import store from "../../store";

export interface ITransferBlockProps {
  data: {
    draggedBlockId: string;
    destinationBlockId: string;
  };
}

function updateBlockInStore(block: IBlock, updates: Partial<IBlock>) {
  store.dispatch(
    blockActions.updateBlockRedux(block.customId, updates, {
      arrayUpdateStrategy: "replace",
    })
  );
}

export function transferBlockStateHelper(props: ITransferBlockProps) {
  const draggedBlock = getBlock(store.getState(), props.data.draggedBlockId)!;
  const destinationBlock = getBlock(
    store.getState(),
    props.data.destinationBlockId
  )!;
  const sourceBlock = getBlock(store.getState(), destinationBlock.parent)!;
  const dropPosition = 0;

  const containerName = `${draggedBlock.type}s`;
  const draggedBlockContainer: string[] = [...sourceBlock[containerName]];
  const draggedBlockIndexInSourceBlock = draggedBlockContainer.indexOf(
    draggedBlock.customId
  );

  if (draggedBlockIndexInSourceBlock === -1) {
    throw new Error("Dragged block not found in source block");
  }

  if (sourceBlock.customId === destinationBlock.customId) {
    if (!(dropPosition >= 0)) {
      // TODO: Find a way to differentiate between log errors and display errors
      throw new Error("Drop position not provided");
    }

    const sourceBlockUpdates: Partial<IBlock> = { updatedAt: getDateString() };

    sourceBlockUpdates[containerName] = reorder(
      draggedBlockContainer,
      draggedBlockIndexInSourceBlock,
      dropPosition
    );

    updateBlockInStore(sourceBlock, sourceBlockUpdates);
  } else {
    const draggedBlockUpdates: Partial<IBlock> = {
      updatedAt: getDateString(),
      parent: destinationBlock.customId,
    };

    draggedBlockContainer.splice(draggedBlockIndexInSourceBlock, 1);

    const sourceBlockUpdates: Partial<IBlock> = {
      updatedAt: getDateString(),
      [containerName]: draggedBlockContainer,
    };

    const destinationBlockContainer = [...destinationBlock[containerName]];

    destinationBlockContainer.splice(dropPosition, 0, draggedBlock.customId);

    const destinationBlockUpdates: Partial<IBlock> = {
      updatedAt: getDateString(),
      [containerName]: destinationBlockContainer,
    };

    updateBlockInStore(sourceBlock, sourceBlockUpdates);
    updateBlockInStore(draggedBlock, draggedBlockUpdates);
    updateBlockInStore(destinationBlock, destinationBlockUpdates);
  }
}

export function hasBlockParentChanged(block: IBlock, update: IBlock) {
  return block.parent !== update.parent;
}
