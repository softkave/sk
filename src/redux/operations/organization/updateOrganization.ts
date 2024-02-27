import assert from "assert";
import { appMessages } from "../../../models/messages";
import { IWorkspace } from "../../../models/organization/types";
import OrganizationAPI, {
  IUpdateOrganizationEndpointParams,
} from "../../../net/organization/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString } from "../../../utils/utils";
import OrganizationActions from "../../organizations/actions";
import OrganizationSelectors from "../../organizations/selectors";
import SessionSelectors from "../../session/selectors";
import { IStoreLikeObject } from "../../types";
import { makeAsyncOp02NoPersist } from "../utils";

export const updateOrganizationOpAction = makeAsyncOp02NoPersist(
  "op/organizations/updateOrganization",
  async (arg: IUpdateOrganizationEndpointParams, thunkAPI, extras) => {
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());
    let organization: IWorkspace = OrganizationSelectors.assertGetOne(
      thunkAPI.getState(),
      arg.organizationId
    );

    if (extras.isDemoMode) {
      organization = {
        ...organization,
        ...arg.data,
        lastUpdatedBy: user.customId,
        lastUpdatedAt: getDateString(),
      };
    } else {
      const result = await OrganizationAPI.updateOrganization(arg);
      assertEndpointResult(result);
      organization = result.organization;
    }

    assert(organization, appMessages.internalError);
    completeUpdateOrganization(thunkAPI, organization);
    return organization;
  }
);

export function completeUpdateOrganization(
  thunkAPI: IStoreLikeObject,
  organization: IWorkspace & { collaboratorIds?: string[] }
) {
  thunkAPI.dispatch(
    OrganizationActions.update({
      id: organization.customId,
      data: organization,
      meta: { arrayUpdateStrategy: "replace" },
    })
  );
}
