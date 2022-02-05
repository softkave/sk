import { IAppOrganization } from "../../../models/organization/types";
import { toAppOrganization } from "../../../models/organization/utils";
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
    let organizations: IAppOrganization[] = [];

    if (extras.isDemoMode) {
    } else {
      const result = await OrganizationAPI.getUserOrganizations();
      assertEndpointResult(result);
      organizations = result.organizations.map((item) =>
        toAppOrganization(item)
      );
    }

    thunkAPI.dispatch(
      OrganizationActions.bulkAdd(toActionAddList(organizations, "customId"))
    );
  }
);
