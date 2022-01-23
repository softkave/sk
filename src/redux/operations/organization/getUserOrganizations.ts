import { IOrganization } from "../../../models/organization/types";
import OrganizationAPI from "../../../net/organization/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import OrganizationActions from "../../organizations/actions";
import { toActionAddList } from "../../utils";
import OperationType from "../OperationType";
import { makeAsyncOp } from "../utils";

export const getUserOrganizationsOpAction = makeAsyncOp(
  "op/organizations/getUserOrganizations",
  OperationType.GetUserOrganizations,
  async (arg: {}, thunkAPI, extras) => {
    let organizations: IOrganization[] = [];

    if (extras.isDemoMode) {
    } else {
      const result = await OrganizationAPI.getUserOrganizations();
      assertEndpointResult(result);
      organizations = result.organizations;
    }

    thunkAPI.dispatch(
      OrganizationActions.bulkAdd(toActionAddList(organizations, "customId"))
    );
  }
);
