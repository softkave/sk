import { IStoreLikeObject } from "../../../redux/types";
import {
    IIncomingBroadcastHistoryPacket,
    IncomingSocketEvents,
} from "../incomingEventTypes";
import handleBlockUpdateEvent from "./handleBlockUpdateEvent";
import handleDeleteSprintEvent from "./handleDeleteSprintEvent";
import handleEndSprintEvent from "./handleEndSprintEvent";
import handleNewMessageEvent from "./handleNewMessageEvent";
import handleNewRoomEvent from "./handleNewRoomEvent";
import handleNewSprintEvent from "./handleNewSprintEvent";
import handleUserCollaborationRequestsEvent from "./handleNewUserCollaborationRequestEvent";
import handleOrgCollaborationRequestsEvent from "./handleOrgCollaborationRequestEvent";
import handleUpdateRoomReadCounterEvent from "./handleRoomReadCounterEvent";
import handleStartSprintEvent from "./handleStartSprintEvent";
import handleUpdateNotificationsEvent from "./handleUpdateNotificationsEvent";
import handleUpdateSprintEvent from "./handleUpdateSprintEvent";
import handleUserUpdateEvent from "./handleUserUpdateEvent";

export default function handleFetchMissingBroadcastsEvent(
    store: IStoreLikeObject,
    data: IIncomingBroadcastHistoryPacket
) {
    if (data && data.errors) {
        return;
    }

    if (data.reload) {
        window.location.reload();
        return;
    }

    const roomIds = Object.keys(data.rooms);

    roomIds.forEach((roomId) => {
        const packets = data.rooms[roomId];

        packets.forEach((packet) => {
            switch (packet.event) {
                case IncomingSocketEvents.BlockUpdate:
                    return handleBlockUpdateEvent(store, packet.data);
                case IncomingSocketEvents.OrgNewCollaborationRequests:
                    return handleOrgCollaborationRequestsEvent(
                        store,
                        packet.data
                    );
                case IncomingSocketEvents.UpdateCollaborationRequests:
                    return handleUpdateNotificationsEvent(store, packet.data);
                case IncomingSocketEvents.UserNewCollaborationRequest:
                    return handleUserCollaborationRequestsEvent(
                        store,
                        packet.data
                    );
                case IncomingSocketEvents.UserUpdate:
                    return handleUserUpdateEvent(store, packet.data);
                case IncomingSocketEvents.UpdateRoomReadCounter:
                    return handleUpdateRoomReadCounterEvent(store, packet.data);
                case IncomingSocketEvents.NewRoom:
                    return handleNewRoomEvent(store, packet.data);
                case IncomingSocketEvents.NewMessage:
                    return handleNewMessageEvent(store, packet.data);
                case IncomingSocketEvents.NewSprint:
                    return handleNewSprintEvent(store, packet.data);
                case IncomingSocketEvents.UpdateSprint:
                    return handleUpdateSprintEvent(store, packet.data);
                case IncomingSocketEvents.StartSprint:
                    return handleStartSprintEvent(store, packet.data);
                case IncomingSocketEvents.EndSprint:
                    return handleEndSprintEvent(store, packet.data);
                case IncomingSocketEvents.DeleteSprint:
                    return handleDeleteSprintEvent(store, packet.data);
            }
        });
    });
}
