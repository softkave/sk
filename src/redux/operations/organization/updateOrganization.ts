import assert from "assert";
import { messages } from "../../../models/messages";
import { IOrganization } from "../../../models/organization/types";
import OrganizationAPI, {
  IUpdateOrganizationEndpointParams,
} from "../../../net/organization/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString } from "../../../utils/utils";
import OrganizationActions from "../../organizations/actions";
import OrganizationSelectors from "../../organizations/selectors";
import SessionSelectors from "../../session/selectors";
import { IStoreLikeObject } from "../../types";
import OperationType from "../OperationType";
import { makeAsyncOp } from "../utils";

export const updateOrganizationOpAction = makeAsyncOp(
  "op/organizations/updateOrganization",
  OperationType.UpdateOrganization,
  async (arg: IUpdateOrganizationEndpointParams, thunkAPI, extras) => {
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());
    let organization: IOrganization = OrganizationSelectors.assertGetOne(
      thunkAPI.getState(),
      arg.organizationId
    );

    if (extras.isDemoMode) {
      organization = {
        ...organization,
        ...arg.data,
        updatedBy: user.customId,
        updatedAt: getDateString(),
      };
    } else {
      const result = await OrganizationAPI.updateOrganization(arg);
      assertEndpointResult(result);
      organization = result.organization;
    }

    assert(organization, messages.internalError);
    completeUpdateOrganization(thunkAPI, organization);
    return organization;
  },
  {
    preFn: (arg) => ({
      resourceId: arg.organizationId,
    }),
  }
);

export function completeUpdateOrganization(
  thunkAPI: IStoreLikeObject,
  organization: IOrganization & { collaboratorIds?: string[] }
) {
  thunkAPI.dispatch(
    OrganizationActions.update({
      id: organization.customId,
      data: organization,
      meta: { arrayUpdateStrategy: "replace" },
    })
  );
}
