import { IBlock } from "../../../models/block/block";
import { getDateString } from "../../../utils/utils";
import BlockActions from "../../blocks/actions";
import BlockSelectors from "../../blocks/selectors";
import { IStoreLikeObject } from "../../types";

export interface ITransferBlockProps {
    draggedBlockId: string;
    destinationBlockId: string;
}

export function hasBlockParentChanged(block: IBlock, update: IBlock) {
    return block.parent !== update.parent;
}

export const storeTransferBlock = (
    store: IStoreLikeObject,
    data: ITransferBlockProps
) => {
    const draggedBlock = BlockSelectors.getBlock(
        store.getState(),
        data.draggedBlockId
    )!;

    const destinationBlock = BlockSelectors.getBlock(
        store.getState(),
        data.destinationBlockId
    )!;

    const draggedBlockUpdates: Partial<IBlock> = {
        updatedAt: getDateString(),
        parent: destinationBlock.customId,
    };

    store.dispatch(
        BlockActions.updateBlock({
            id: draggedBlock.customId,
            data: draggedBlockUpdates,
            meta: {
                arrayUpdateStrategy: "replace",
            },
        })
    );
};
