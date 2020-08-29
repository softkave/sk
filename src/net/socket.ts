import delay from "lodash/delay";
import io, { Socket } from "socket.io-client";
import { IBlock } from "../models/block/block";
import {
    CollaborationRequestStatusType,
    INotification,
} from "../models/notification/notification";
import BlockSelectors from "../redux/blocks/selectors";
import KeyValueActions from "../redux/key-value/actions";
import KeyValueSelectors from "../redux/key-value/selectors";
import { KeyValueKeys } from "../redux/key-value/types";
import NotificationActions from "../redux/notifications/actions";
import NotificationSelectors from "../redux/notifications/selectors";
import { completeAddBlock } from "../redux/operations/block/addBlock";
import { completeDeleteBlock } from "../redux/operations/block/deleteBlock";
import { completeUpdateBlock } from "../redux/operations/block/updateBlock";
import { completeLoadUserNotifications } from "../redux/operations/notification/loadUserNotifications";
import {
    completePartialNotificationResponse,
    completeUserNotificationResponse,
} from "../redux/operations/notification/respondToNotification";
import SessionSelectors from "../redux/session/selectors";
import store from "../redux/store";
import { getSockAddr } from "./addr";

let socket: typeof Socket | null = null;
let connectionFailedBefore = false;

export interface ISocketConnectionProps {
    token: string;
    clientId: string;
}

export enum IncomingSocketEvents {
    Connect = "connect",
    Disconnect = "disconent",
    BlockUpdate = "blockUpdate",
    NewNotifications = "newNotifications",
    UserUpdate = "userUpdate",
    UpdateNotification = "updateNotification",
    UserCollaborationRequestResponse = "userCollabReqResponse",
    OrgCollaborationRequestResponse = "orgCollabReqResponse",
}

export function connectSocket(props: ISocketConnectionProps) {
    if (socket || connectionFailedBefore) {
        return;
    }

    const addr = getSockAddr();

    // TODO: is there a way to change the XMLHTTPRequest object credential's property
    //   used in the polling transport?
    socket = io(addr.url, {
        path: addr.path,
    });

    socket.on(IncomingSocketEvents.Connect, () =>
        handleConnect(props.token, props.clientId)
    );
    socket.on(IncomingSocketEvents.Disconnect, handleDisconnect);
    socket.on(IncomingSocketEvents.BlockUpdate, handleBlockUpdate);
    socket.on(IncomingSocketEvents.NewNotifications, handleNewNotifications);
    socket.on(
        IncomingSocketEvents.OrgCollaborationRequestResponse,
        handleOrgCollaborationRequestResponse
    );
    socket.on(
        IncomingSocketEvents.UpdateNotification,
        handleUpdateNotification
    );
    socket.on(
        IncomingSocketEvents.UserCollaborationRequestResponse,
        handleUserCollaborationRequestResponse
    );
    socket.on(IncomingSocketEvents.UserUpdate, handleUserUpdate);
}

export function getSocket() {
    return socket;
}

export enum OutgoingSocketEvents {
    Auth = "auth",
    Subscribe = "subscribe",
    Unsubscribe = "unsubscribe",
    FetchMissingBroadcasts = "fetchMissingBroadcasts",
}

// outgoing packets

export interface IOutgoingAuthPacket {
    token: string;
    clientId: string;
}

export interface IOutgoingSubscribePacket {
    customId: string;
    type: "board" | "org" | "user";
}

interface IOutgoingFetchMissingBroadcastsPacket {
    rooms: string[];
    from: number;
}

// incoming packets

interface IIncomingAuthPacket {
    valid: boolean;
}

interface IIncomingBroadcastHistoryPacket {
    rooms: { [key: string]: Array<{ event: IncomingSocketEvents; data: any }> };
    reload?: boolean;
}

export interface IBlockUpdatePacket {
    customId: string;
    isNew?: boolean;
    isUpdate?: boolean;
    isDelete?: boolean;
    block?: Partial<IBlock> | IBlock;
}

export interface INewNotificationsPacket {
    notifications: INotification[];
}

export interface IUserUpdatePacket {
    notificationsLastCheckedAt: string;
}

export interface IUpdateNotificationPacket {
    customId: string;
    data: { readAt: string };
}

export interface IUserCollaborationRequestResponsePacket {
    customId: string;
    response: CollaborationRequestStatusType;
    org?: IBlock;
}

export interface IOrgCollaborationRequestResponsePacket {
    customId: string;
    response: CollaborationRequestStatusType;
}

// tslint:disable-next-line: no-empty-interface
export interface IBoardUpdatePacket {}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}

function handleConnect(token: string, clientId: string) {
    const authData: IOutgoingAuthPacket = { token, clientId };
    socket?.emit(OutgoingSocketEvents.Auth, authData, handleAuthResponse);
}

function handleAuthResponse(data: IIncomingAuthPacket) {
    if (!data.valid) {
        connectionFailedBefore = true;

        // TODO: maybe show notification
        const tenSecsInMs = 10000;
        delay(() => {
            socket?.disconnect();
        }, tenSecsInMs);

        return;
    }

    const rooms =
        KeyValueSelectors.getKey(store.getState(), KeyValueKeys.Rooms) || {};
    const roomIds = Object.keys(rooms);

    roomIds.forEach((roomId) => {
        const split = roomId.split("-");
        const type = split.shift();
        const resourceId = split.join("-"); // we use uuids, and they ( uuid ) use '-'
        subscribe(type as any, resourceId);
    });

    const socketDisconnectedAt = KeyValueSelectors.getKey(
        store.getState(),
        KeyValueKeys.SocketDisconnectTimestamp
    );

    if (socketDisconnectedAt) {
        store.dispatch(
            KeyValueActions.setKey({
                key: KeyValueKeys.FetchingMissingBroadcasts,
                value: true,
            })
        );
        fetchMissingBroadcasts(socketDisconnectedAt as number, roomIds);
    }
}

function handleDisconnect() {
    socket = null;

    if (connectionFailedBefore) {
        return;
    }

    const socketDisconnectedAt = Date.now();
    const isUserLoggedIn = SessionSelectors.isUserSignedIn(store.getState());

    if (isUserLoggedIn) {
        store.dispatch(
            KeyValueActions.setKey({
                key: KeyValueKeys.SocketDisconnectTimestamp,
                value: socketDisconnectedAt,
            })
        );
    }
}

function handleFetchMissingBroadcastsResponse(
    data: IIncomingBroadcastHistoryPacket
) {
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
                    return handleBlockUpdate(packet.data);
                case IncomingSocketEvents.NewNotifications:
                    return handleNewNotifications(packet.data);
                case IncomingSocketEvents.OrgCollaborationRequestResponse:
                    return handleOrgCollaborationRequestResponse(packet.data);
                case IncomingSocketEvents.UpdateNotification:
                    return handleUpdateNotification(packet.data);
                case IncomingSocketEvents.UserCollaborationRequestResponse:
                    return handleUserCollaborationRequestResponse(packet.data);
                case IncomingSocketEvents.UserUpdate:
                    return handleUserUpdate(packet.data);
            }
        });
    });

    store.dispatch(
        KeyValueActions.setKey({
            key: KeyValueKeys.FetchingMissingBroadcasts,
            value: false,
        })
    );
}

function handleBlockUpdate(data: IBlockUpdatePacket) {
    if (data.isNew && data.block) {
        // TODO: how can we gracefully add changes
        store.dispatch(
            completeAddBlock({ block: data.block as IBlock }) as any
        );
    } else if (data.isUpdate) {
        const block = BlockSelectors.getBlock(store.getState(), data.customId);
        store.dispatch(completeUpdateBlock({ block, data: data.block! }));
    } else if (data.isDelete) {
        const block = BlockSelectors.getBlock(store.getState(), data.customId);
        store.dispatch(completeDeleteBlock({ block }));
    }
}

function handleNewNotifications(data: INewNotificationsPacket) {
    // TODO: alert the user of new notifications
    // either by a notification, message, or the red badge on Notifications
    // also, new notifications should have the new badge
    // update the user's notification check time if the user has notifications past the current time ( local )
    // update user's notification check time in the server when the user fetches notifications
    // and some are past the user's current time ( time sorted notifications )
    // add notification ids to the user's data
    // sort user's notifications on fetch, and sort the incoming, and add them to the rest
    store.dispatch(
        completeLoadUserNotifications({ notifications: data.notifications })
    );
}

function handleOrgCollaborationRequestResponse(
    data: IOrgCollaborationRequestResponsePacket
) {
    const notification = NotificationSelectors.getNotification(
        store.getState(),
        data.customId
    );

    store.dispatch(
        completePartialNotificationResponse({
            request: notification,
            response: data.response,
        })
    );
}

function handleUpdateNotification(data: IUpdateNotificationPacket) {
    store.dispatch(
        NotificationActions.updateNotification({
            id: data.customId,
            data: { readAt: data.data.readAt },
            meta: {
                arrayUpdateStrategy: "replace",
            },
        })
    );
}

function handleUserCollaborationRequestResponse(
    data: IUserCollaborationRequestResponsePacket
) {
    const notification = NotificationSelectors.getNotification(
        store.getState(),
        data.customId
    );

    store.dispatch(
        completeUserNotificationResponse({
            request: notification,
            response: data.response,
            block: data.org,
        })
    );
}

function handleUserUpdate(data: IUserUpdatePacket) {
    // TODO: most likely not needed anymore
}

export function subscribe(
    type: IOutgoingSubscribePacket["type"],
    resourceId: string
) {
    if (socket) {
        const data: IOutgoingSubscribePacket = { type, customId: resourceId };
        socket.emit(OutgoingSocketEvents.Subscribe, data);

        const rooms =
            KeyValueSelectors.getKey(store.getState(), KeyValueKeys.Rooms) ||
            {};
        const roomId = `${type}-${resourceId}`;

        if (!!rooms[roomId]) {
            return;
        }

        store.dispatch(KeyValueActions.pushRoom(roomId));
    }
}

export function unsubcribe(
    type: IOutgoingSubscribePacket["type"],
    resourceId: string
) {
    if (socket) {
        const data: IOutgoingSubscribePacket = { type, customId: resourceId };
        socket.emit(OutgoingSocketEvents.Unsubscribe, data);

        const rooms =
            KeyValueSelectors.getKey(store.getState(), KeyValueKeys.Rooms) ||
            {};
        const roomId = `${type}-${resourceId}`;

        if (!!!rooms[roomId]) {
            return;
        }

        store.dispatch(KeyValueActions.removeRoom(roomId));
    }
}

function fetchMissingBroadcasts(from: number, rooms: string[]) {
    const arg: IOutgoingFetchMissingBroadcastsPacket = { from, rooms };
    socket?.emit(
        OutgoingSocketEvents.FetchMissingBroadcasts,
        arg,
        handleFetchMissingBroadcastsResponse
    );
}
