import { IBlock } from "../../../models/block/block";
import BlockSelectors from "../../../redux/blocks/selectors";
import { completeAddBlock } from "../../../redux/operations/block/addBlock";
import { completeDeleteBlock } from "../../../redux/operations/block/deleteBlock";
import { completeUpdateBlock } from "../../../redux/operations/block/updateBlock";
import store from "../../../redux/store";
import { IIncomingBlockUpdatePacket } from "../incomingEventTypes";

export default function handleBlockUpdateEvent(
    data: IIncomingBlockUpdatePacket
) {
    if (data.data) {
        const innerData = data.data;

        if (innerData.isNew && innerData.block) {
            store.dispatch(
                completeAddBlock({ block: innerData.block as IBlock }) as any
            );
        } else if (innerData.isUpdate) {
            const block = BlockSelectors.getBlock(
                store.getState(),
                innerData.customId
            );

            store.dispatch(
                completeUpdateBlock({ block, data: innerData.block! })
            );
        } else if (innerData.isDelete) {
            const block = BlockSelectors.getBlock(
                store.getState(),
                innerData.customId
            );

            store.dispatch(completeDeleteBlock({ block }));
        }
    }
}
