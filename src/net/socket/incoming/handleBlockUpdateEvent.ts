import {
    IPersistedBlock,
    persistedBlockToBlock,
} from "../../../models/block/block";
import BlockSelectors from "../../../redux/blocks/selectors";
import { storeNewBlock } from "../../../redux/operations/block/addBlock";
import { storeDeleteBlock } from "../../../redux/operations/block/deleteBlock";
import { storeUpdateBlock } from "../../../redux/operations/block/updateBlock";
import { IStoreLikeObject } from "../../../redux/types";
import { IIncomingBlockUpdatePacket } from "../incomingEventTypes";

export default function handleBlockUpdateEvent(
    store: IStoreLikeObject,
    data: IIncomingBlockUpdatePacket
) {
    if (data && !data.errors) {
        console.log(data);
        if (data.isNew && data.block) {
            console.log("is new");
            storeNewBlock(
                store,
                persistedBlockToBlock(data.block as IPersistedBlock)
            );
        } else if (data.isUpdate && data.block) {
            const block = BlockSelectors.getBlock(
                store.getState(),
                data.customId
            );

            storeUpdateBlock(store, block, data.block);
        } else if (data.isDelete) {
            storeDeleteBlock(store, data.customId);
        }
    }
}
