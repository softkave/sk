import {
  IOutgoingUpdateSocketEntryPacket,
  OutgoingSocketEvents,
} from "../outgoingEventTypes";
import SocketAPI from "../socket";

export default async function updateSocketEntryEvent(
  data: Partial<IOutgoingUpdateSocketEntryPacket>
): Promise<void> {
  return SocketAPI.promisifiedEmit(
    OutgoingSocketEvents.UpdateSocketEntry,
    data
  );
}
