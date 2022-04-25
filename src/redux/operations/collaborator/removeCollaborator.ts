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
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());

    if (!extras.isDemoMode) {
      const result = await CollaboratorAPI.removeCollaborator(arg);
      assertEndpointResult(result);
    }

    completeRemoveCollaborator(
      thunkAPI,
      arg.organizationId,
      user.customId,
      arg.collaboratorId
    );
  }
);

export function completeRemoveCollaborator(
  thunkAPI: IStoreLikeObject,
  organizationId: string,
  userId: string,
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

  if (organizations.length === 0 && collaboratorId !== userId) {
    thunkAPI.dispatch(UserActions.remove(collaboratorId));
  }
}
