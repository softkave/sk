import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import { appMessages } from "../../models/messages";
import SessionSelectors from "../session/selectors";
import { IAppState } from "../types";
import { getSelectors } from "../utils";

const CollaborationRequestSelectors = getSelectors<ICollaborationRequest>("collaborationRequests", {
  notFoundMessage: appMessages.collaborationRequestNotFound,
});

export default CollaborationRequestSelectors;

export function getUserRequestsFromStore(state: IAppState) {
  const user = SessionSelectors.assertGetUser(state);
  const email = user.email.toLowerCase();
  return CollaborationRequestSelectors.filter(
    state,
    (item) => item.to.email.toLowerCase() === email
  );
}

export function getOrganizationRequestsFromStore(state: IAppState, organizationId: string) {
  return CollaborationRequestSelectors.filter(
    state,
    (item) => item.from.workspaceId === organizationId
  );
}
