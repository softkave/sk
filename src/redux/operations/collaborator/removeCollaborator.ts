import CollaboratorAPI, {
  IRemoveCollaboratorEndpointParams,
} from "../../../net/collaborator/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import OrganizationActions from "../../organizations/actions";
import OrganizationSelectors from "../../organizations/selectors";
import SessionSelectors from "../../session/selectors";
import UserActions from "../../users/actions";
import OperationType from "../OperationType";
import { makeAsyncOp } from "../utils";

export const removeCollaboratorOpAction = makeAsyncOp(
  "op/collaborators/removeCollaborator",
  OperationType.DeleteBoard,
  async (arg: IRemoveCollaboratorEndpointParams, thunkAPI, extras) => {
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());

    if (extras.isDemoMode) {
    } else {
      const result = await CollaboratorAPI.removeCollaborator(arg);
      assertEndpointResult(result);
    }

    let organization = OrganizationSelectors.assertGetOne(
      thunkAPI.getState(),
      arg.organizationId
    );

    organization = { ...organization };
    organization.collaboratorIds = [...organization.collaboratorIds];
    organization.collaboratorIds.splice(
      organization.collaboratorIds.indexOf(arg.collaboratorId),
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
        item.collaboratorIds.includes(arg.collaboratorId) &&
        item.customId !== arg.organizationId
    );

    if (organizations.length === 0 && arg.collaboratorId !== user.customId) {
      thunkAPI.dispatch(UserActions.remove(arg.collaboratorId));
    }
  }
);
