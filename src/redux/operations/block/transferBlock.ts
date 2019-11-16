import { Dispatch } from "redux";
import { makeBlockParentIDs } from "../../../components/block/getNewBlock";
import { IBlock } from "../../../models/block/block";
import { blockErrorMessages } from "../../../models/block/blockErrorMessages";
import { blockConstants } from "../../../models/block/constants";
import * as blockActions from "../../blocks/actions";
import { getEveryBlockChildrenInState } from "../../blocks/selectors";
import { IReduxState } from "../../store";

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

function getIndex(list: any[], item: any, notFoundError?: string | Error) {
  const itemIndex = list.indexOf(item);

  if (itemIndex === -1) {
    throw notFoundError;
  }

  return itemIndex;
}

function move(
  list: any[],
  item: any,
  dropPosition: number,
  notFoundError?: string | Error,
  getItemIndex = getIndex
) {
  const itemIndex = getItemIndex(list, item, notFoundError);
  list = [...list];
  list.splice(itemIndex, 1);
  list.splice(dropPosition, 0, item);
  return list;
}

function remove(
  list: any[],
  item: any,
  notFoundError?: string | Error,
  getItemIndex = getIndex
) {
  const itemIndex = getItemIndex(list, item, notFoundError);
  list = [...list];
  list.splice(itemIndex, 1);
  return list;
}

function add(list: any[], item: any, dropPosition?: number) {
  list = Array.isArray(list) ? [...list] : [];

  if (dropPosition) {
    list.splice(dropPosition, 0, item);
  } else {
    list.push(item);
  }

  return list;
}

function checkBlocks(props: ITransferBlockReduxProps) {
  const { sourceBlock, draggedBlock, destinationBlock } = props;

  if (!draggedBlock) {
    throw new Error(blockErrorMessages.transferDraggedBlockMissing);
  }

  if (!sourceBlock) {
    throw new Error(blockErrorMessages.transferSourceBlockMissing);
  }

  if (sourceBlock.customId !== destinationBlock.customId && !destinationBlock) {
    throw new Error(blockErrorMessages.transferDestinationBlockMissing);
  }
}

function updateDraggedBlockPositionInSource(props: ITransferBlockReduxProps) {
  const { groupContext, sourceBlock, draggedBlock, dropPosition } = props;
  const sourceBlockUpdates: Partial<IBlock> = {};

  if (!dropPosition) {
    // TODO: Find a way to differentiate between log errors and display errors
    throw new Error(blockErrorMessages.transferDropPositionNotProvided);
  }

  if (draggedBlock.type === blockConstants.blockTypes.group) {
    if (groupContext) {
      sourceBlockUpdates[groupContext] = move(
        sourceBlock[groupContext],
        draggedBlock.customId,
        dropPosition,
        blockErrorMessages.transferDraggedBlockNotFoundInParent
      );
    } else {
      const groupTaskContext = blockConstants.groupContexts.groupTaskContext;
      const groupProjectContext =
        blockConstants.groupContexts.groupProjectContext;

      sourceBlockUpdates[groupTaskContext] = move(
        sourceBlock[groupTaskContext],
        draggedBlock.customId,
        dropPosition,
        blockErrorMessages.transferDraggedBlockNotFoundInParent
      );

      sourceBlockUpdates[groupProjectContext] = move(
        sourceBlock[groupProjectContext],
        draggedBlock.customId,
        dropPosition,
        blockErrorMessages.transferDraggedBlockNotFoundInParent
      );
    }
  }

  const pluralizedType = `${draggedBlock.type}s`;
  sourceBlockUpdates[pluralizedType] = move(
    sourceBlock[pluralizedType],
    draggedBlock.customId,
    dropPosition,
    blockErrorMessages.transferDraggedBlockNotFoundInParent
  );

  return sourceBlockUpdates;
}

function updateDraggedBlockInSourceAndDestination(
  props: ITransferBlockReduxProps
) {
  const { draggedBlock, sourceBlock, destinationBlock } = props;
  const sourceBlockUpdates: Partial<IBlock> = {};
  const draggedBlockUpdates: Partial<IBlock> = {};
  const destinationBlockUpdates: Partial<IBlock> = {};
  const pluralizedType = `${draggedBlock.type}s`;

  if (draggedBlock.type === blockConstants.blockTypes.group) {
    const groupTaskContext = blockConstants.groupContexts.groupTaskContext;
    const groupProjectContext =
      blockConstants.groupContexts.groupProjectContext;

    sourceBlockUpdates[groupTaskContext] = remove(
      sourceBlock[groupTaskContext],
      draggedBlock.customId,
      blockErrorMessages.transferDraggedBlockNotFoundInParent
    );

    sourceBlockUpdates[groupProjectContext] = remove(
      sourceBlock[groupProjectContext],
      draggedBlock.customId,
      blockErrorMessages.transferDraggedBlockNotFoundInParent
    );

    destinationBlockUpdates[groupTaskContext] = add(
      destinationBlock[pluralizedType],
      draggedBlock.customId
    );

    destinationBlockUpdates[groupProjectContext] = add(
      destinationBlock[pluralizedType],
      draggedBlock.customId
    );
  }

  sourceBlockUpdates[pluralizedType] = remove(
    sourceBlock[pluralizedType],
    draggedBlock.customId,
    blockErrorMessages.transferDraggedBlockNotFoundInParent
  );

  destinationBlockUpdates[pluralizedType] = add(
    destinationBlock[pluralizedType],
    draggedBlock.customId
  );

  const draggedBlockParentUpdate = [...(destinationBlock.parents || [])];
  draggedBlockParentUpdate.push(destinationBlock.customId);
  draggedBlockUpdates.parents = draggedBlockParentUpdate;

  return {
    sourceBlockUpdates,
    destinationBlockUpdates,
    draggedBlockUpdates
  };
}

function updateBlockInStore(
  dispatch: Dispatch,
  block: IBlock,
  updates: Partial<IBlock>
) {
  dispatch(
    blockActions.updateBlockRedux(block.customId, updates, {
      arrayUpdateStrategy: "replace"
    })
  );
}

export function transferBlockStateHelper(
  state: IReduxState,
  dispatch: Dispatch,
  props: ITransferBlockReduxProps
) {
  checkBlocks(props);

  const sourceBlock = props.sourceBlock;
  const draggedBlock = props.draggedBlock;
  const destinationBlock = props.destinationBlock;

  if (sourceBlock.customId === destinationBlock.customId) {
    const sourceBlockUpdates = updateDraggedBlockPositionInSource(props);
    updateBlockInStore(dispatch, sourceBlock, sourceBlockUpdates);
  } else {
    // Ignores paremeters' groupContext and dropPosition
    const {
      sourceBlockUpdates,
      destinationBlockUpdates,
      draggedBlockUpdates
    } = updateDraggedBlockInSourceAndDestination(props);

    updateBlockInStore(dispatch, sourceBlock, sourceBlockUpdates);
    updateBlockInStore(dispatch, draggedBlock, draggedBlockUpdates);
    updateBlockInStore(dispatch, destinationBlock, destinationBlockUpdates);

    if (draggedBlock.type !== "task") {
      const blockChildren = getEveryBlockChildrenInState(state, draggedBlock);
      const draggedBlockChildrenUpdates: Partial<IBlock> = {
        parents: makeBlockParentIDs({ ...draggedBlock, ...draggedBlockUpdates })
      };

      dispatch(
        blockActions.bulkUpdateBlocksRedux(
          blockChildren.map(child => {
            return {
              id: child.customId,
              data: draggedBlockChildrenUpdates
            };
          }),
          { arrayUpdateStrategy: "replace" }
        )
      );
    }
  }
}

export function hasBlockParentsChanged(block: IBlock, update: IBlock) {
  return !!block.parents.find((id, index) => id !== update.parents[index]);
}
