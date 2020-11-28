import io, { Socket } from "socket.io-client";
import SessionSelectors from "../../redux/session/selectors";
import store from "../../redux/store";
import { IStoreLikeObject } from "../../redux/types";
import { getSockAddr } from "../addr";
import handleBlockUpdateEvent from "./incoming/handleBlockUpdateEvent";
import handleConnectEvent from "./incoming/handleConnectEvent";
import handleDeleteSprintEvent from "./incoming/handleDeleteSprintEvent";
import handleDisconnectEvent from "./incoming/handleDisconnectEvent";
import handleEndSprintEvent from "./incoming/handleEndSprintEvent";
import handleNewMessageEvent from "./incoming/handleNewMessageEvent";
import handleNewRoomEvent from "./incoming/handleNewRoomEvent";
import handleNewSprintEvent from "./incoming/handleNewSprintEvent";
import handleUserCollaborationRequestsEvent from "./incoming/handleNewUserCollaborationRequestEvent";
import handleOrgCollaborationRequestsEvent from "./incoming/handleOrgCollaborationRequestEvent";
import handleUpdateRoomReadCounterEvent from "./incoming/handleRoomReadCounterEvent";
import handleStartSprintEvent from "./incoming/handleStartSprintEvent";
import handleUpdateNotificationsEvent from "./incoming/handleUpdateNotificationsEvent";
import handleUpdateSprintEvent from "./incoming/handleUpdateSprintEvent";
import handleUserUpdateEvent from "./incoming/handleUserUpdateEvent";
import { IncomingSocketEvents } from "./incomingEventTypes";
import { IOutgoingEventPacket } from "./outgoingEventTypes";

class SocketNotConnectedError extends Error {
    public name = "SocketNotConnectedError";
    public message = "Error connecting to the server";
}

export interface ISocketConnectionProps {
    token: string;
}

function makeSocketEventHandler(str: IStoreLikeObject, fn) {
    return (data) => fn(store, data);
}

// tslint:disable-next-line: max-classes-per-file
export default class SocketAPI {
    public static socket: typeof Socket | null = null;
    public static connFailedBefore = false;
    public static authCompleted = false;
    public static waitQueue: Array<(sock: typeof Socket | null) => void> = [];

    public static flushWaitQueue() {
        if (SocketAPI.waitQueue.length > 0) {
            SocketAPI.waitQueue.forEach((cb) => {
                cb(SocketAPI.socket);
            });
        }
    }

    public static getSocket() {
        return SocketAPI.socket;
    }

    public static async waitGetSocket() {
        if (
            SocketAPI.socket &&
            SocketAPI.socket.connected &&
            SocketAPI.authCompleted
        ) {
            return SocketAPI.socket;
        }

        return new Promise<typeof Socket>((resolve, reject) => {
            if (SocketAPI.connFailedBefore) {
                reject(new SocketNotConnectedError());
            }

            SocketAPI.waitQueue.push((sock) => {
                if (sock) {
                    resolve(sock);
                } else {
                    reject(new SocketNotConnectedError());
                }
            });
        });
    }

    public static promisifiedEmit<Ack = any>(eventName: string, data?: any) {
        return new Promise<Ack>(async (resolve, reject) => {
            try {
                const sock = await SocketAPI.waitGetSocket();
                const packet: IOutgoingEventPacket = {
                    data,
                    token: SessionSelectors.assertGetToken(store.getState()),
                };

                sock.emit(eventName, packet, (ackData: Ack) => {
                    resolve(ackData);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    public static connectSocket(props: ISocketConnectionProps) {
        if (SocketAPI.socket || SocketAPI.connFailedBefore) {
            return;
        }

        const addr = getSockAddr();

        // TODO: is there a way to change the XMLHTTPRequest object credential's property
        // used in the polling transport?
        const socket = io(addr.url, {
            path: addr.path,
        });

        SocketAPI.socket = socket;

        socket.on(IncomingSocketEvents.Connect, () =>
            handleConnectEvent(store, props.token)
        );
        socket.on(
            IncomingSocketEvents.Disconnect,
            makeSocketEventHandler(store, handleDisconnectEvent)
        );
        socket.on(
            IncomingSocketEvents.BlockUpdate,
            makeSocketEventHandler(store, handleBlockUpdateEvent)
        );
        socket.on(
            IncomingSocketEvents.OrgNewCollaborationRequests,

            makeSocketEventHandler(store, handleOrgCollaborationRequestsEvent)
        );
        socket.on(
            IncomingSocketEvents.UpdateCollaborationRequests,

            makeSocketEventHandler(store, handleUpdateNotificationsEvent)
        );
        socket.on(
            IncomingSocketEvents.UserNewCollaborationRequest,

            makeSocketEventHandler(store, handleUserCollaborationRequestsEvent)
        );
        socket.on(
            IncomingSocketEvents.UserUpdate,
            makeSocketEventHandler(store, handleUserUpdateEvent)
        );
        socket.on(
            IncomingSocketEvents.UpdateRoomReadCounter,

            makeSocketEventHandler(store, handleUpdateRoomReadCounterEvent)
        );
        socket.on(
            IncomingSocketEvents.NewRoom,
            makeSocketEventHandler(store, handleNewRoomEvent)
        );
        socket.on(
            IncomingSocketEvents.NewMessage,
            makeSocketEventHandler(store, handleNewMessageEvent)
        );
        socket.on(
            IncomingSocketEvents.NewSprint,
            makeSocketEventHandler(store, handleNewSprintEvent)
        );
        socket.on(
            IncomingSocketEvents.UpdateSprint,
            makeSocketEventHandler(store, handleUpdateSprintEvent)
        );
        socket.on(
            IncomingSocketEvents.StartSprint,
            makeSocketEventHandler(store, handleStartSprintEvent)
        );
        socket.on(
            IncomingSocketEvents.EndSprint,
            makeSocketEventHandler(store, handleEndSprintEvent)
        );
        socket.on(
            IncomingSocketEvents.DeleteSprint,
            makeSocketEventHandler(store, handleDeleteSprintEvent)
        );
    }

    public static disconnectSocket() {
        if (SocketAPI.socket) {
            SocketAPI.socket.disconnect();
            SocketAPI.socket = null;
        }
    }

    public static isConnected() {
        return !!SocketAPI.socket;
    }
}
