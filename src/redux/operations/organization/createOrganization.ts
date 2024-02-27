import assert from "assert";
import { appMessages } from "../../../models/messages";
import { IWorkspace } from "../../../models/organization/types";
import { toAppOrganization } from "../../../models/organization/utils";
import OrganizationAPI, {
  ICreateOrganizationEndpointParams,
} from "../../../net/organization/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import { getNewId } from "../../../utils/ids";
import { getDateString } from "../../../utils/utils";
import OrganizationActions from "../../organizations/actions";
import SessionSelectors from "../../session/selectors";
import { IStoreLikeObject } from "../../types";
import { makeAsyncOp02NoPersist } from "../utils";

export const createOrganizationOpAction = makeAsyncOp02NoPersist(
  "op/organizations/createOrganization",
  async (arg: ICreateOrganizationEndpointParams, thunkAPI, extras) => {
    if (extras.isAnonymousUser) {
      throw new Error(
        "Invalid operation, anonymous users cannot create organizations. You'll need to signup or login to create an organization"
      );
    }

    let organization: IWorkspace | null = null;
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());
    if (extras.isDemoMode) {
      const id = getNewId();
      organization = {
        ...arg.organization,
        customId: id,
        workspaceId: id,
        createdBy: user.customId,
        createdAt: getDateString(),
        visibility: "organization",
      };
    } else {
      const result = await OrganizationAPI.createOrganization(arg);
      assertEndpointResult(result);
      organization = result.organization;
    }

    assert(organization, appMessages.internalError);
    completeStoreOrganization(thunkAPI, organization);
    return organization;
  }
);

export function completeStoreOrganization(thunkAPI: IStoreLikeObject, organization: IWorkspace) {
  thunkAPI.dispatch(
    OrganizationActions.update({
      id: organization.customId,
      data: toAppOrganization(organization),
      meta: { arrayUpdateStrategy: "replace" },
    })
  );
}
