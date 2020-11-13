export default function subscribeEvent(items: ClientSubscribedResources) {
    if (socket && items.length > 0) {
        const data: IOutgoingSubscribePacket = { items };
        const roomsToPush: string[] = [];

        socket.emit(OutgoingSocketEvents.Subscribe, data);

        const rooms =
            KeyValueSelectors.getKey<ClientSubscribedResources>(
                store.getState(),
                KeyValueKeys.RoomsSubscribedTo
            ) || {};

        items.forEach((item) => {
            const roomSignature = getRoomId(item);

            if (!rooms[roomSignature]) {
                roomsToPush.push(roomSignature);
            }
        });

        store.dispatch(KeyValueActions.pushRooms(roomsToPush));
    }
}
