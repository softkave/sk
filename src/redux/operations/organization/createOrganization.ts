import assert from "assert";
import { BlockType } from "../../../models/block/block";
import { messages } from "../../../models/messages";
import { IOrganization } from "../../../models/organization/types";
import OrganizationAPI, {
  ICreateOrganizationEndpointParams,
} from "../../../net/organization/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString, getNewId } from "../../../utils/utils";
import OrganizationActions from "../../organizations/actions";
import SessionSelectors from "../../session/selectors";
import OperationType from "../OperationType";
import { makeAsyncOp } from "../utils";

export const createOrganizationOpAction = makeAsyncOp(
  "op/organizations/createOrganization",
  OperationType.CreateOrganization,
  async (arg: ICreateOrganizationEndpointParams, thunkAPI, extras) => {
    let organization: IOrganization | null = null;
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());

    if (extras.isDemoMode) {
      organization = {
        ...arg,
        customId: getNewId(),
        createdBy: user.customId,
        createdAt: getDateString(),
        type: BlockType.Organization,
      };
    } else {
      const result = await OrganizationAPI.createOrganization(arg);
      assertEndpointResult(result);
      organization = result.organization;
    }

    assert(organization, messages.internalError);
    thunkAPI.dispatch(
      OrganizationActions.add({
        id: organization.customId,
        data: organization,
      })
    );

    return organization;
  }
);
