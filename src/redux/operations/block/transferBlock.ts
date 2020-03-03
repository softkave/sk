import { IBlock } from "../../../models/block/block";
import * as blockActions from "../../blocks/actions";
import store from "../../store";

export default async function transferBlockOperation() {
  throw new Error("Not implemented yet");
}

// TODO: define any types, and make sure other types are correct
export interface ITransferBlockReduxProps {
  sourceBlock: IBlock;
  draggedBlock: IBlock;
  destinationBlock: IBlock;
  dropPosition?: number;
  groupContext?: string;
}

function updateBlockInStore(block: IBlock, updates: Partial<IBlock>) {
  store.dispatch(
    blockActions.updateBlockRedux(block.customId, updates, {
      arrayUpdateStrategy: "replace"
    })
  );
}

export function transferBlockStateHelper(props: ITransferBlockReduxProps) {
  const sourceBlock = props.sourceBlock;
  const draggedBlock = props.draggedBlock;
  const destinationBlock = props.destinationBlock;
  const dropPosition = props.dropPosition || 0;
  const groupContext = props.groupContext;

  const draggedBlockContainerName = `${draggedBlock.type}s`;
  const draggedBlockContainer: string[] = [
    ...sourceBlock[draggedBlockContainerName]
  ];
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

    const sourceBlockUpdates: Partial<IBlock> = {};

    draggedBlockContainer.splice(draggedBlockIndexInSourceBlock, 1);
    draggedBlockContainer.splice(dropPosition, 0, draggedBlock.customId);
    sourceBlockUpdates[draggedBlockContainerName] = draggedBlockContainer;

    if (groupContext && draggedBlock.type === "group") {
      const groupContextContainerName =
        groupContext === "project" ? "groupProjectContext" : "groupTaskContext";
      const groupContextContainer = [
        ...(sourceBlock[groupContextContainerName] || [])
      ];
      const draggedBlockIndexInGroupContext = groupContextContainer.indexOf(
        draggedBlock.customId
      );

      groupContextContainer.splice(draggedBlockIndexInGroupContext, 1);
      groupContextContainer.splice(dropPosition, 0, draggedBlock.customId);
      sourceBlockUpdates[groupContextContainerName] = groupContextContainer;
    }

    updateBlockInStore(sourceBlock, sourceBlockUpdates);
  } else {
    // Ignores paremeters' groupContext and dropPosition

    const draggedBlockUpdates: Partial<IBlock> = {
      parent: destinationBlock.customId
    };

    draggedBlockContainer.splice(draggedBlockIndexInSourceBlock, 1);
    const sourceBlockUpdates: Partial<IBlock> = {
      [draggedBlockContainerName]: draggedBlockContainer
    };

    const destinationBlockContainer = [
      ...destinationBlock[draggedBlockContainerName]
    ];
    destinationBlockContainer.splice(dropPosition, 0, draggedBlock.customId);
    const destinationBlockUpdates: Partial<IBlock> = {
      [draggedBlockContainerName]: destinationBlockContainer
    };

    updateBlockInStore(sourceBlock, sourceBlockUpdates);
    updateBlockInStore(draggedBlock, draggedBlockUpdates);
    updateBlockInStore(destinationBlock, destinationBlockUpdates);
  }
}

export function hasBlockParentChanged(block: IBlock, update: IBlock) {
  return block.parent !== update.parent;
}
