import CollaboratorAPI, {
  IRemoveCollaboratorEndpointParams,
} from "../../../net/collaborator/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import OrganizationActions from "../../organizations/actions";
import OrganizationSelectors from "../../organizations/selectors";
import SessionSelectors from "../../session/selectors";
import { IStoreLikeObject } from "../../types";
import UserActions from "../../users/actions";
import OperationType from "../OperationType";
import { makeAsyncOp } from "../utils";

export const removeCollaboratorOpAction = makeAsyncOp(
  "op/collaborators/removeCollaborator",
  OperationType.DeleteBoard,
  async (arg: IRemoveCollaboratorEndpointParams, thunkAPI, extras) => {
    if (!extras.isDemoMode) {
      const result = await CollaboratorAPI.removeCollaborator(arg);
      assertEndpointResult(result);
    }

    completeRemoveCollaborator(
      thunkAPI,
      arg.organizationId,
      arg.collaboratorId
    );
  }
);

export function completeRemoveCollaborator(
  thunkAPI: IStoreLikeObject,
  organizationId: string,
  collaboratorId: string
) {
  let organization = OrganizationSelectors.getOne(
    thunkAPI.getState(),
    organizationId
  );

  if (!organization) {
    return;
  }

  organization = { ...organization };
  organization.collaboratorIds = [...organization.collaboratorIds];
  organization.collaboratorIds.splice(
    organization.collaboratorIds.indexOf(collaboratorId),
    1
  );

  thunkAPI.dispatch(
    OrganizationActions.update({
      id: organization.customId,
      data: organization,
      meta: { arrayUpdateStrategy: "replace" },
    })
  );

  const organizations = OrganizationSelectors.filter(
    thunkAPI.getState(),
    (item) =>
      item.collaboratorIds.includes(collaboratorId) &&
      item.customId !== organizationId
  );

  const user = SessionSelectors.assertGetUser(thunkAPI.getState());

  if (organizations.length === 0 && collaboratorId !== user.customId) {
    thunkAPI.dispatch(UserActions.remove(collaboratorId));
  }
}
