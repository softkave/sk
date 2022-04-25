import io, { Socket } from "socket.io-client";
import SessionSelectors from "../../redux/session/selectors";
import store from "../../redux/store";
import { IStoreLikeObject } from "../../redux/types";
import { getSockAddr } from "../addr";
import handleConnectEvent from "./incoming/handleConnectEvent";
import handleDisconnectEvent from "./incoming/handleDisconnectEvent";
import { handleResourceUpdateEvent } from "./incoming/resourceUpdate";
import { IncomingSocketEvents } from "./incomingEventTypes";
import { IOutgoingEventPacket } from "./outgoingEventTypes";

class SocketNotConnectedError extends Error {
  public name = "SocketNotConnectedError";
  public message = "Error connecting to the server";
}

export interface ISocketConnectionProps {
  token: string;
  clientId: string;
}

function makeSocketEventHandler(str: IStoreLikeObject, fn) {
  return (data) => fn(store, data);
}

// tslint:disable-next-line: max-classes-per-file
export default class SocketAPI {
  public static socket: Socket | null = null;
  public static connFailedBefore = false;
  public static authCompleted = false;
  public static waitQueue: Array<(sock: Socket | null) => void> = [];

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

    return new Promise<Socket>((resolve, reject) => {
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
          clientId: SessionSelectors.assertGetClient(store.getState()).clientId,
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
      handleConnectEvent(store, props.token, props.clientId)
    );
    socket.on(
      IncomingSocketEvents.Disconnect,
      makeSocketEventHandler(store, handleDisconnectEvent)
    );
    socket.on(
      IncomingSocketEvents.ResourceUpdate,
      makeSocketEventHandler(store, handleResourceUpdateEvent)
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
