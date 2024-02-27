import { SystemActionType, SystemResourceType } from "../../models/app/types";

export enum IncomingSocketEvents {
  Connect = "connect",
  Disconnect = "disconent",
  ResourceUpdate = "ResourceUpdate",
}

export interface IIncomingResourceUpdatePacket<T = any> {
  actionType: SystemActionType;
  resourceType: SystemResourceType;
  resource: T;
  roomName: string;
}
