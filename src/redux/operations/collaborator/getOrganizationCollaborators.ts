import CollaboratorAPI, {
  IGetOrganizationCollaboratorsEndpointParams,
} from "../../../net/collaborator/endpoints";
import OrganizationActions from "../../organizations/actions";
import UserActions from "../../users/actions";
import { toActionAddList } from "../../utils";
import { makeAsyncOp02 } from "../utils";

export const getOrganizationCollaboratorsOpAction = makeAsyncOp02(
  "op/collaborators/getOrganizationCollaborators",
  async (arg: IGetOrganizationCollaboratorsEndpointParams, thunkAPI) => {
    const result = await CollaboratorAPI.getOrganizationCollaborators({
      organizationId: arg.organizationId,
    });
    thunkAPI.dispatch(UserActions.bulkUpdate(toActionAddList(result.collaborators, "customId")));
    const itemIds = result.collaborators.map((item) => item.customId);
    thunkAPI.dispatch(
      OrganizationActions.update({
        id: arg.organizationId,
        data: { collaboratorIds: itemIds },
        meta: { arrayUpdateStrategy: "replace" },
      })
    );
  }
);
