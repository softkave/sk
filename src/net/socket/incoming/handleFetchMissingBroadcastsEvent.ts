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
import handleUserCollaborationRequestEvent from "./handleNewUserCollaborationRequestEvent";
import handleUpdateRoomReadCounterEvent from "./handleRoomReadCounterEvent";
import handleStartSprintEvent from "./handleStartSprintEvent";
import handleUpdateNotificationsEvent from "./handleUpdateNotificationsEvent";
import handleUpdateSprintEvent from "./handleUpdateSprintEvent";
import handleUserUpdateEvent from "./handleUserUpdateEvent";

export default function handleFetchMissingBroadcastsEvent(
    data: IIncomingBroadcastHistoryPacket
) {
    if (!data.data) {
        return;
    }

    const innerData = data.data;

    if (innerData.reload) {
        window.location.reload();
        return;
    }

    const roomIds = Object.keys(innerData.rooms);

    roomIds.forEach((roomId) => {
        const packets = innerData.rooms[roomId];

        packets.forEach((packet) => {
            switch (packet.event) {
                case IncomingSocketEvents.BlockUpdate:
                    return handleBlockUpdateEvent(packet.data);
                case IncomingSocketEvents.NewNotifications:
                    return handleNewNotifications(packet.data);
                case IncomingSocketEvents.OrgCollaborationRequestResponse:
                    return handleOrgCollaborationRequestResponse(packet.data);
                case IncomingSocketEvents.UpdateNotification:
                    return handleUpdateNotificationsEvent(packet.data);
                case IncomingSocketEvents.UserCollaborationRequestResponse:
                    return handleUserCollaborationRequestEvent(packet.data);
                case IncomingSocketEvents.UserUpdate:
                    return handleUserUpdateEvent(packet.data);
                case IncomingSocketEvents.UpdateRoomReadCounter:
                    return handleUpdateRoomReadCounterEvent(packet.data);
                case IncomingSocketEvents.NewRoom:
                    return handleNewRoomEvent(packet.data);
                case IncomingSocketEvents.NewMessage:
                    return handleNewMessageEvent(packet.data);
                case IncomingSocketEvents.NewSprint:
                    return handleNewSprintEvent(packet.data);
                case IncomingSocketEvents.UpdateSprint:
                    return handleUpdateSprintEvent(packet.data);
                case IncomingSocketEvents.StartSprint:
                    return handleStartSprintEvent(packet.data);
                case IncomingSocketEvents.EndSprint:
                    return handleEndSprintEvent(packet.data);
                case IncomingSocketEvents.DeleteSprint:
                    return handleDeleteSprintEvent(packet.data);
            }
        });
    });
}
