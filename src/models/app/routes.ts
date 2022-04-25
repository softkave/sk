export const appRoutes = {
  app: "/app",
};

export const appLoggedInPaths = {
  organizations: `${appRoutes.app}/orgs`,
  requests: `${appRoutes.app}/requests`,
};

export function isUserViewingOrg(orgId: string) {
  return window.location.pathname.includes(orgId);
}

export function isUserViewingChatRoom(orgId: string, recipientId: string) {
  return (
    isUserViewingOrg(orgId) && window.location.pathname.includes(recipientId)
  );
}
