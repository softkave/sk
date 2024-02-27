export const appRoutes = {
  wildcard: "*",
  home: "/",
  app: "/app",
  signup: "/signup",
  login: "/login",
  forgotPassword: "/forgot-password",
  changePassword: "/change-password",
};

export const appLoggedInPaths = {
  organizations: `${appRoutes.app}/orgs`,
  requests: `${appRoutes.app}/requests`,
  settings: `${appRoutes.app}/settings`,
};

export const appRequestsPaths = {
  requestSelector: `${appLoggedInPaths.requests}/:requestId`,
  request: (requestId: string) => `${appLoggedInPaths.requests}/${requestId}`,
};

export const appOrganizationPaths = {
  organizationSelector: `${appLoggedInPaths.organizations}/:organizationId`,
  organization: (organizationId: string) => `${appLoggedInPaths.organizations}/${organizationId}`,
  boards: (organizationId: string) => `${appLoggedInPaths.organizations}/${organizationId}/boards`,
  collaborators: (organizationId: string) =>
    `${appLoggedInPaths.organizations}/${organizationId}/collaborators`,
  requests: (organizationId: string) =>
    `${appLoggedInPaths.organizations}/${organizationId}/requests`,
  chats: (organizationId: string) => `${appLoggedInPaths.organizations}/${organizationId}/chat`,
  chatRoom: (organizationId: string, roomId: string) =>
    `${appLoggedInPaths.organizations}/${organizationId}/chat/${roomId}`,
  permissions: (organizationId: string) =>
    `${appLoggedInPaths.organizations}/${organizationId}/permissions`,
  pgList(organizationId: string) {
    return `${this.permissions(organizationId)}/pg`;
  },
  permissionsCollaboratorList(organizationId: string) {
    return `${this.permissions(organizationId)}/collaborators`;
  },
  pg(organizationId: string, pgId: string) {
    return `${this.pgList(organizationId)}/${pgId}`;
  },
};

export const appBoardPaths = {
  boardSelector() {
    return this.board(":organizationId", ":boardId");
  },
  board: (organizationId: string, boardId: string) =>
    `${appOrganizationPaths.boards(organizationId)}/${boardId}`,
  tasks(organizationId: string, boardId: string) {
    return `${this.board(organizationId, boardId)}/tasks`;
  },
  permissions(organizationId: string, boardId: string) {
    return `${this.board(organizationId, boardId)}/permissions`;
  },
  pgList(organizationId: string, boardId: string) {
    return `${this.permissions(organizationId, boardId)}/pg`;
  },
  permissionsCollaboratorList(organizationId: string, boardId: string) {
    return `${this.permissions(organizationId, boardId)}/collaborators`;
  },
  pg(organizationId: string, boardId: string, pgId: string) {
    return `${this.pgList(organizationId, boardId)}/${pgId}`;
  },
};

export function isUserViewingOrg(orgId: string) {
  return window.location.pathname.includes(orgId);
}

export function isUserViewingChatRoom(orgId: string, recipientId: string) {
  return isUserViewingOrg(orgId) && window.location.pathname.includes(recipientId);
}
