import { IBlock, IPersistedBlock } from "../../models/block/block";
import { IChat, IRoomMemberWithReadCounter } from "../../models/chat/types";
import {
    CollaborationRequestStatusType,
    INotification,
} from "../../models/notification/notification";
import { ISprint, SprintDuration } from "../../models/sprint/types";
import { IClient } from "../../models/user/user";
import { IPersistedRoom } from "../chat/chat";
import { GetEndpointResult } from "../types";

export enum IncomingSocketEvents {
    Connect = "connect",
    Disconnect = "disconent",
    BlockUpdate = "blockUpdate",
    OrgNewCollaborationRequests = "orgNewCollaborationRequests",
    UserNewCollaborationRequest = "userNewCollaborationRequest",
    UserUpdate = "userUpdate",
    UpdateCollaborationRequests = "updateCollaborationRequests",
    CollaborationRequestResponse = "collabReqResponse",
    NewRoom = "newRoom",
    NewMessage = "newMessage",
    UpdateRoomReadCounter = "updateRoomReadCounter",
    NewSprint = "newSprint",
    UpdateSprint = "updateSprint",
    EndSprint = "endSprint",
    StartSprint = "startSprint",
    DeleteSprint = "deleteSprint",
    UpdateClient = "updateClient",
}

export type IIncomingBlockUpdatePacket = GetEndpointResult<{
    customId: string;
    isNew?: boolean;
    isUpdate?: boolean;
    isDelete?: boolean;
    block?: Partial<IPersistedBlock>;
}>;

export type IIncomingBroadcastHistoryPacket = GetEndpointResult<{
    rooms: { [key: string]: Array<{ event: IncomingSocketEvents; data: any }> };
    reload?: boolean;
}>;

export type IIncomingNewNotificationsPacket = GetEndpointResult<{
    notifications: INotification[];
}>;

export type IIncomingUserUpdatePacket = GetEndpointResult<{
    notificationsLastCheckedAt: string;
}>;

export type IIncomingUpdateNotificationsPacket = GetEndpointResult<{
    notifications: Array<{
        id: string;
        data: Partial<INotification>;
    }>;
}>;

export type IIncomingCollaborationRequestResponsePacket = GetEndpointResult<{
    customId: string;
    response: CollaborationRequestStatusType;
    respondedAt: string;
    org?: IBlock;
}>;

export type IIncomingNewRoomPacket = GetEndpointResult<{
    room: IPersistedRoom;
}>;

export type IIncomingSendMessagePacket = GetEndpointResult<{
    chat: IChat;
}>;

export type IIncomingUpdateRoomReadCounterPacket = GetEndpointResult<{
    roomId: string;
    member: IRoomMemberWithReadCounter;
}>;

export type IIncomingNewSprintPacket = GetEndpointResult<{
    sprint: ISprint;
}>;

export type IIncomingUpdateSprintPacket = GetEndpointResult<{
    sprintId: string;
    data: {
        name?: string;
        duration?: SprintDuration;
        updatedAt: string;
        updatedBy: string;
    };
}>;

export type IIncomingEndSprintPacket = GetEndpointResult<{
    sprintId: string;
    endedAt: string;
    endedBy: string;
}>;

export type IIncomingStartSprintPacket = GetEndpointResult<{
    sprintId: string;
    startedAt: string;
    startedBy: string;
}>;

export type IIncomingDeleteSprintPacket = GetEndpointResult<{
    sprintId: string;
}>;

export type IIncomingUpdateClientPacket = GetEndpointResult<{
    client: IClient;
}>;
