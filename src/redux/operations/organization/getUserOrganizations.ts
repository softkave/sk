import { IAppOrganization } from "../../../models/organization/types";
import { toAppOrganization } from "../../../models/organization/utils";
import ChatAPI, {
  IGetOrganizationUnseenChatsCountEndpointResult,
} from "../../../net/chat/chat";
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

    if (!extras.isDemoMode) {
      const result = await OrganizationAPI.getUserOrganizations();
      assertEndpointResult(result);
      const unseenChatsCountResult = await Promise.allSettled(
        result.organizations.map((organization) =>
          ChatAPI.getOrganizationUnseenChatsCount({
            orgId: organization.customId,
          })
        )
      );
      organizations = result.organizations.map((item, index) => {
        const countResult: PromiseSettledResult<IGetOrganizationUnseenChatsCountEndpointResult> =
          unseenChatsCountResult[index];
        const unseenChatsCount =
          countResult.status === "fulfilled" && !countResult.value.errors
            ? countResult.value.count
            : 0;
        return toAppOrganization(item, {
          unseenChatsCount,
        });
      });
    }

    thunkAPI.dispatch(
      OrganizationActions.bulkAdd(toActionAddList(organizations, "customId"))
    );
  }
);
