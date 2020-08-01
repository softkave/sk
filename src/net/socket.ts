import delay from "lodash/delay";
import io, { Socket } from "socket.io-client";
import { IBlock } from "../models/block/block";
import {
  CollaborationRequestStatusType,
  INotification,
} from "../models/notification/notification";
import BlockSelectors from "../redux/blocks/selectors";
import KeyValueActions from "../redux/key-value/actions";
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
import store from "../redux/store";
import { getSockAddr } from "./addr";

let socket: typeof Socket | null = null;
let connectionFailedBefore = false;

export interface ISocketConnectionProps {
  token: string;
}

export function connectSocket(props: ISocketConnectionProps) {
  console.log("connectSocket");

  if (socket || connectionFailedBefore) {
    return;
  }

  const addr = getSockAddr();

  // TODO: is there a way to change the XMLHTTPRequest object credential's property
  //   used in the polling transport?
  socket = io(addr.url, {
    path: addr.path,
  });

  console.log({ socket });

  socket.on(IncomingSocketEvents.Connect, () => {
    const authData: IOutgoingAuthPacket = { token: props.token };
    socket?.emit(
      OutgoingSocketEvents.Auth,
      authData,
      (data: IIncomingAuthPacket) => {
        if (!data.valid) {
          connectionFailedBefore = true;

          // TODO
          // maybe show notification
          const tenSecsInMs = 10000;
          delay(() => {
            socket?.disconnect();
          }, tenSecsInMs);
        }
      }
    );
  });

  socket.on(IncomingSocketEvents.Disconnect, () => {
    socket = null;
  });

  socket.on(IncomingSocketEvents.BlockUpdate, (data: IBlockUpdatePacket) => {
    if (data.isNew && data.block) {
      // TODO: how can we gracefully add changes
      store.dispatch(completeAddBlock({ block: data.block as IBlock }) as any);
    } else if (data.isUpdate) {
      const block = BlockSelectors.getBlock(store.getState(), data.customId);
      store.dispatch(completeUpdateBlock({ block, data: data.block! }));
    } else if (data.isDelete) {
      const block = BlockSelectors.getBlock(store.getState(), data.customId);
      store.dispatch(completeDeleteBlock({ block }));
    }
  });

  socket.on(IncomingSocketEvents.BoardUpdate, (data: IBoardUpdatePacket) => {
    store.dispatch(
      KeyValueActions.setKey({
        key: KeyValueKeys.ReloadBoard,
        value: true,
      })
    );
  });

  socket.on(
    IncomingSocketEvents.NewNotifications,
    (data: INewNotificationsPacket) => {
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
  );

  socket.on(
    IncomingSocketEvents.OrgCollaborationRequestResponse,
    (data: IOrgCollaborationRequestResponsePacket) => {
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
  );

  socket.on(
    IncomingSocketEvents.UpdateNotification,
    (data: IUpdateNotificationPacket) => {
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
  );

  socket.on(
    IncomingSocketEvents.UserCollaborationRequestResponse,
    (data: IUserCollaborationRequestResponsePacket) => {
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
  );

  socket.on(IncomingSocketEvents.UserUpdate, (data: IUserUpdatePacket) => {
    // TODO: most likely not needed anymore
  });
}

export function getSocket() {
  return socket;
}

export enum OutgoingSocketEvents {
  Auth = "auth",
  Subscribe = "subscribe",
  Unsubscribe = "unsubscribe",
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
  BoardUpdate = "boardUpdate",
}

// outgoing packets

export interface IOutgoingAuthPacket {
  token: string;
}

export interface IOutgoingSubscribePacket {
  customId: string;
  type: "board";
}

// incoming packets

interface IIncomingAuthPacket {
  valid: boolean;
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

export function subscribeToBlock(blockId: string) {
  console.log({ socket });
  if (socket) {
    const data: IOutgoingSubscribePacket = { customId: blockId, type: "board" };
    socket.emit(OutgoingSocketEvents.Subscribe, data);
  }
}

export function unsubcribeFromBlock(blockId: string) {
  if (socket) {
    const data: IOutgoingSubscribePacket = { customId: blockId, type: "board" };
    socket.emit(OutgoingSocketEvents.Unsubscribe, data);
  }
}
