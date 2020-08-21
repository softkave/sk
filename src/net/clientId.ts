let clientId = "";

export function getClientId() {
  console.log("getting client id");
  return clientId;
}

export function setClientId(id: string) {
  clientId = id;
  console.log("setting client id", id);
  return clientId;
}

export function clearClientId() {
  clientId = "";
}
