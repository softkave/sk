export interface IChat {
    customId: string;
    orgId: string;
    message: string;
    sender: string;
    roomId: string;
    createdAt: string;
    updatedAt?: string;
}

export interface IRoomMemberWithReadCounter {
    userId: string;
    readCounter: string;
}

export interface IRoom {
    customId: string;
    name: string;
    orgId: string;
    createdAt: string;
    createdBy: string;
    members: IRoomMemberWithReadCounter[];
    updatedAt?: string;
    updatedBy?: string;
}
