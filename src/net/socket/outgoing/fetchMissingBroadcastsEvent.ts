export default function fetchMissingBroadcastsEvent(
    fromTimestamp: number,
    rooms: string[]
) {
    const arg: IOutgoingFetchMissingBroadcastsPacket = {
        rooms,
        from: fromTimestamp,
    };

    return promisifiedEmit<IIncomingBroadcastHistoryPacket>(
        OutgoingSocketEvents.FetchMissingBroadcasts,
        arg
    );
}
