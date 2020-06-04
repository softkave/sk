import { IBlock } from "../../../models/block/block";
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

  console.log({ draggedBlock, destinationBlock });

  const draggedBlockUpdates: Partial<IBlock> = {
    updatedAt: getDateString(),
    parent: destinationBlock.customId,
  };

  updateBlockInStore(draggedBlock, draggedBlockUpdates);
}

export function hasBlockParentChanged(block: IBlock, update: IBlock) {
  return block.parent !== update.parent;
}
