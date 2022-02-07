import { ICollaborator } from "../../../models/collaborator/types";
import CollaboratorAPI, {
  IGetOrganizationCollaboratorsEndpointParams,
} from "../../../net/collaborator/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import OrganizationActions from "../../organizations/actions";
import OrganizationSelectors from "../../organizations/selectors";
import UserActions from "../../users/actions";
import { toActionAddList } from "../../utils";
import OperationType from "../OperationType";
import { makeAsyncOp } from "../utils";

export const getOrganizationCollaboratorsOpAction = makeAsyncOp(
  "op/collaborators/getOrganizationCollaborators",
  OperationType.GetOrganizationCollaborators,
  async (
    arg: IGetOrganizationCollaboratorsEndpointParams,
    thunkAPI,
    extras
  ) => {
    let collaborators: ICollaborator[] = [];

    if (extras.isDemoMode) {
    } else {
      const result = await CollaboratorAPI.getOrganizationCollaborators({
        organizationId: arg.organizationId,
      });

      assertEndpointResult(result);
      collaborators = result.collaborators;
    }

    thunkAPI.dispatch(
      UserActions.bulkAdd(toActionAddList(collaborators, "customId"))
    );

    let organization = OrganizationSelectors.assertGetOne(
      thunkAPI.getState(),
      arg.organizationId
    );

    organization = { ...organization };
    organization.collaboratorIds = collaborators.map((item) => item.customId);
    thunkAPI.dispatch(
      OrganizationActions.update({
        id: organization.customId,
        data: organization,
        meta: { arrayUpdateStrategy: "replace" },
      })
    );
  },
  {
    preFn: (arg) => ({
      resourceId: arg.organizationId,
    }),
  }
);
