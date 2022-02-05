import assert from "assert";
import { messages } from "../../../models/messages";
import { toAppOrganization } from "../../../models/organization/utils";
import OrganizationAPI, {
  IUpdateOrganizationEndpointParams,
} from "../../../net/organization/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString } from "../../../utils/utils";
import OrganizationActions from "../../organizations/actions";
import OrganizationSelectors from "../../organizations/selectors";
import SessionSelectors from "../../session/selectors";
import OperationType from "../OperationType";
import { makeAsyncOp } from "../utils";

export const updateOrganizationOpAction = makeAsyncOp(
  "op/organizations/updateOrganization",
  OperationType.UpdateOrganization,
  async (arg: IUpdateOrganizationEndpointParams, thunkAPI, extras) => {
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());
    let organization = OrganizationSelectors.assertGetOne(
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
      organization = toAppOrganization(result.organization);
    }

    assert(organization, messages.internalError);
    thunkAPI.dispatch(
      OrganizationActions.update({
        id: organization.customId,
        data: organization,
        meta: { arrayUpdateStrategy: "replace" },
      })
    );

    return organization;
  },
  {
    preFn: (arg) => ({
      resourceId: arg.organizationId,
    }),
  }
);
