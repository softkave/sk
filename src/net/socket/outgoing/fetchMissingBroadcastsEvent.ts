import { IIncomingBroadcastHistoryPacket } from "../incomingEventTypes";
import {
  IOutgoingFetchMissingBroadcastsPacket,
  OutgoingSocketEvents,
} from "../outgoingEventTypes";
import SocketAPI from "../socket";

export default async function fetchMissingBroadcastsEvent(
  fromTimestamp: number,
  rooms: string[]
): Promise<IIncomingBroadcastHistoryPacket> {
  const arg: IOutgoingFetchMissingBroadcastsPacket = {
    rooms,
    from: fromTimestamp,
  };

  return SocketAPI.promisifiedEmit<IIncomingBroadcastHistoryPacket>(
    OutgoingSocketEvents.FetchMissingBroadcasts,
    arg
  );
}
