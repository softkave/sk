import { IStoreLikeObject } from "../../../redux/types";
import { IIncomingBlockUpdatePacket } from "../incomingEventTypes";

export default function handleBlockUpdateEvent(
  store: IStoreLikeObject,
  data: IIncomingBlockUpdatePacket
) {
  // if (data && !data.errors) {
  //   if (data.isNew && data.block) {
  //     store.dispatch();
  //     storeNewBlock(
  //       store,
  //       persistedBlockToBlock(data.block as IPersistedBlock)
  //     );
  //   } else if (data.isUpdate && data.block) {
  //     const block = BlockSelectors.getBlock(store.getState(), data.customId);
  //     storeUpdateBlock(store, block, data.block);
  //   } else if (data.isDelete) {
  //     storeDeleteBlock(store, data.customId);
  //   }
  // }
}
