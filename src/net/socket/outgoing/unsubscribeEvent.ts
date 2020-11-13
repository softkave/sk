export default function unsubcribeEvent(items: ClientSubscribedResources) {
    if (socket && items.length > 0) {
        const data: IOutgoingSubscribePacket = { items };
        const roomsToRemove: string[] = [];
        socket.emit(OutgoingSocketEvents.Unsubscribe, data);

        const rooms =
            KeyValueSelectors.getKey(
                store.getState(),
                KeyValueKeys.RoomsSubscribedTo
            ) || {};

        items.forEach((item) => {
            const roomId = `${item.type}-${item.customId}`;

            if (rooms[roomId]) {
                roomsToRemove.push(roomId);
            }
        });

        store.dispatch(KeyValueActions.removeRooms(roomsToRemove));
    }
}
