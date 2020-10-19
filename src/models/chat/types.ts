import { IPersistedRoom } from "../../net/chat/chat";

// TODO: should we make the createdAt and other timstamps numbers on the client-side
// for increased performance?
export interface IChat {
    customId: string;
    orgId: string;
    message: string;
    sender: string;
    roomId: string;
    createdAt: string;
    updatedAt?: string;

    sending?: boolean;
    queued?: boolean;
    errorMessage?: string;
}

export interface IRoomMemberWithReadCounter {
    userId: string;
    readCounter: string;
}

export interface IRoom extends IPersistedRoom {
    unseenChatsStartIndex: number | null;
    unseenChatsCount: number;
    chats: IChat[];
    recipientId: string;
}
