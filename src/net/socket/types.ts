export interface IOutgoingSocketEventPacket<T = any> {
    token: string;
    data?: T;
}
