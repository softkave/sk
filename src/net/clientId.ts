let clientId = "";

export function getClientId() {
    return clientId;
}

export function setClientId(id: string) {
    clientId = id;

    return clientId;
}

export function clearClientId() {
    clientId = "";
}
