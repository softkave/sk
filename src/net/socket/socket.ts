import io, { Socket } from "socket.io-client";
import store from "../../redux/store";
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

class SocketNotConnectedError extends Error {
    public name = "SocketNotConnectedError";
    public message = "Error connecting to the server";
}

export interface ISocketConnectionProps {
    token: string;
}

// tslint:disable-next-line: max-classes-per-file
export default class SocketAPI {
    public static socket: typeof Socket | null = null;
    public static connFailedBefore = false;
    public static authCompleted = false;
    public static waitQueue: Array<(sock: typeof Socket | null) => void> = [];

    public static flushWaitQueue(sock: typeof Socket | null) {
        if (SocketAPI.waitQueue.length > 0) {
            SocketAPI.waitQueue.forEach((cb) => {
                cb(sock);
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

                sock.emit(eventName, data, (ackData: Ack) => {
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

        socket.on(IncomingSocketEvents.Connect, () =>
            handleConnectEvent(store, props.token)
        );
        socket.on(IncomingSocketEvents.Disconnect, handleDisconnectEvent);
        socket.on(IncomingSocketEvents.BlockUpdate, handleBlockUpdateEvent);
        socket.on(
            IncomingSocketEvents.OrgNewCollaborationRequests,
            handleOrgCollaborationRequestsEvent
        );
        socket.on(
            IncomingSocketEvents.UpdateCollaborationRequests,
            handleUpdateNotificationsEvent
        );
        socket.on(
            IncomingSocketEvents.UpdateCollaborationRequests,
            handleUserCollaborationRequestsEvent
        );
        socket.on(IncomingSocketEvents.UserUpdate, handleUserUpdateEvent);
        socket.on(
            IncomingSocketEvents.UpdateRoomReadCounter,
            handleUpdateRoomReadCounterEvent
        );
        socket.on(IncomingSocketEvents.NewRoom, handleNewRoomEvent);
        socket.on(IncomingSocketEvents.NewMessage, handleNewMessageEvent);
        socket.on(IncomingSocketEvents.NewSprint, handleNewSprintEvent);
        socket.on(IncomingSocketEvents.UpdateSprint, handleUpdateSprintEvent);
        socket.on(IncomingSocketEvents.StartSprint, handleStartSprintEvent);
        socket.on(IncomingSocketEvents.EndSprint, handleEndSprintEvent);
        socket.on(IncomingSocketEvents.DeleteSprint, handleDeleteSprintEvent);

        SocketAPI.socket = socket;
    }

    public static disconnectSocket() {
        if (SocketAPI.socket) {
            SocketAPI.socket.disconnect();
            SocketAPI.socket = null;
        }
    }
}
