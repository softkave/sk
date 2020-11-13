import { IBlock } from "../../models/block/block";
import { IChat, IRoomMemberWithReadCounter } from "../../models/chat/types";
import {
    CollaborationRequestStatusType,
    INotification,
} from "../../models/notification/notification";
import { ISprint, SprintDuration } from "../../models/sprint/types";
import { IPersistedRoom } from "../chat/chat";
import { IIncomingSocketEventPacket } from "./types";

export enum IncomingSocketEvents {
    Connect = "connect",
    Disconnect = "disconent",
    BlockUpdate = "blockUpdate",
    OrgNewCollaborationRequests = "orgNewCollaborationRequests",
    UserNewCollaborationRequest = "userNewCollaborationRequest",
    UserUpdate = "userUpdate",
    UpdateCollaborationRequests = "updateCollaborationRequests",
    UserCollaborationRequestResponse = "userCollabReqResponse",
    NewRoom = "newRoom",
    NewMessage = "newMessage",
    UpdateRoomReadCounter = "updateRoomReadCounter",
    NewSprint = "newSprint",
    UpdateSprint = "updateSprint",
    EndSprint = "endSprint",
    StartSprint = "startSprint",
    DeleteSprint = "deleteSprint",
}

export type IIncomingBlockUpdatePacket = IIncomingSocketEventPacket<{
    customId: string;
    isNew?: boolean;
    isUpdate?: boolean;
    isDelete?: boolean;
    block?: Partial<IBlock>;
}>;

export type IIncomingBroadcastHistoryPacket = IIncomingSocketEventPacket<{
    rooms: { [key: string]: Array<{ event: IncomingSocketEvents; data: any }> };
    reload?: boolean;
}>;

export type IIncomingNewNotificationsPacket = IIncomingSocketEventPacket<{
    notifications: INotification[];
}>;

export type IIncomingUserUpdatePacket = IIncomingSocketEventPacket<{
    notificationsLastCheckedAt: string;
}>;

export type IIncomingUpdateNotificationsPacket = IIncomingSocketEventPacket<{
    notifications: Array<{
        customId: string;
        data: Partial<INotification>;
    }>;
}>;

export type IIncomingCollaborationRequestResponsePacket = IIncomingSocketEventPacket<{
    customId: string;
    response: CollaborationRequestStatusType;
    respondedAt: string;
    org?: IBlock;
}>;

export type IIncomingNewRoomPacket = IIncomingSocketEventPacket<{
    room: IPersistedRoom;
}>;

export type IIncomingSendMessagePacket = IIncomingSocketEventPacket<{
    chat: IChat;
}>;

export type IIncomingUpdateRoomReadCounterPacket = IIncomingSocketEventPacket<{
    roomId: string;
    member: IRoomMemberWithReadCounter;
}>;

export type IIncomingNewSprintPacket = IIncomingSocketEventPacket<{
    sprint: ISprint;
}>;

export type IIncomingUpdateSprintPacket = IIncomingSocketEventPacket<{
    sprintId: string;
    data: {
        name?: string;
        duration?: SprintDuration;
        updatedAt: string;
        updatedBy: string;
    };
}>;

export type IIncomingEndSprintPacket = IIncomingSocketEventPacket<{
    sprintId: string;
    endedAt: string;
    endedBy: string;
}>;

export type IIncomingStartSprintPacket = IIncomingSocketEventPacket<{
    sprintId: string;
    startedAt: string;
    startedBy: string;
}>;

export type IIncomingDeleteSprintPacket = IIncomingSocketEventPacket<{
    sprintId: string;
}>;
