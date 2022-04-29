export const appRoutes = {
  app: "/app",
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
  organization: (organizationId: string) =>
    `${appLoggedInPaths.organizations}/${organizationId}`,
  boards: (organizationId: string) =>
    `${appLoggedInPaths.organizations}/${organizationId}/boards`,
  requests: (organizationId: string) =>
    `${appLoggedInPaths.organizations}/${organizationId}/requests`,
  chats: (organizationId: string) =>
    `${appLoggedInPaths.organizations}/${organizationId}/chat`,
};

export function isUserViewingOrg(orgId: string) {
  return window.location.pathname.includes(orgId);
}

export function isUserViewingChatRoom(orgId: string, recipientId: string) {
  return (
    isUserViewingOrg(orgId) && window.location.pathname.includes(recipientId)
  );
}
