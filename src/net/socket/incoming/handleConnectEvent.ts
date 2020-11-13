export default function handleConnectEvent(token: string, clientId: string) {
    const authData: IOutgoingAuthPacket = { token, clientId };
    socket?.emit(OutgoingSocketEvents.Auth, authData, handleAuthResponse);
}
