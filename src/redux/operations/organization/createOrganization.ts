import assert from "assert";
import { BlockType } from "../../../models/block/block";
import { messages } from "../../../models/messages";
import { IAppOrganization } from "../../../models/organization/types";
import { toAppOrganization } from "../../../models/organization/utils";
import OrganizationAPI, {
  ICreateOrganizationEndpointParams,
} from "../../../net/organization/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString, getNewId } from "../../../utils/utils";
import OrganizationActions from "../../organizations/actions";
import SessionSelectors from "../../session/selectors";
import { IStoreLikeObject } from "../../types";
import OperationType from "../OperationType";
import { makeAsyncOp } from "../utils";

export const createOrganizationOpAction = makeAsyncOp(
  "op/organizations/createOrganization",
  OperationType.CreateOrganization,
  async (arg: ICreateOrganizationEndpointParams, thunkAPI, extras) => {
    let organization: IAppOrganization | null = null;
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());

    if (extras.isDemoMode) {
      organization = {
        ...arg.organization,
        customId: getNewId(),
        createdBy: user.customId,
        createdAt: getDateString(),
        type: BlockType.Organization,
        collaboratorIds: [],
      };
    } else {
      const result = await OrganizationAPI.createOrganization(arg);
      assertEndpointResult(result);
      organization = toAppOrganization(result.organization);
    }

    assert(organization, messages.internalError);
    completeCreateOrganization(thunkAPI, organization);
    return organization;
  }
);

export function completeCreateOrganization(
  thunkAPI: IStoreLikeObject,
  organization: IAppOrganization
) {
  thunkAPI.dispatch(
    OrganizationActions.add({
      id: organization.customId,
      data: organization,
    })
  );
}
