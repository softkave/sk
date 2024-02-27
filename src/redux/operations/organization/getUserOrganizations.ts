import { SystemResourceType } from "../../../models/app/types";
import { IAppWorkspace } from "../../../models/organization/types";
import { toAppOrganization } from "../../../models/organization/utils";
import ChatAPI, { IGetOrganizationUnseenChatsCountEndpointResult } from "../../../net/chat/chat";
import OrganizationAPI from "../../../net/organization/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import MapsSelectors from "../../maps/selectors";
import OrganizationActions from "../../organizations/actions";
import { toActionAddList } from "../../utils";
import { makeAsyncOp02 } from "../utils";

export const getUserOrganizationsOpAction = makeAsyncOp02(
  "op/organizations/getUserOrganizations",
  async (arg: {}, thunkAPI, extras) => {
    let organizations: IAppWorkspace[] = [];
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
        const existingOrg = MapsSelectors.getItem<IAppWorkspace>(
          thunkAPI.getState(),
          SystemResourceType.Workspace,
          item.customId
        );
        return toAppOrganization(item, {
          boardIds: existingOrg?.boardIds,
          collaboratorIds: existingOrg?.collaboratorIds,
          unseenChatsCount,
        });
      });
    }

    thunkAPI.dispatch(OrganizationActions.bulkUpdate(toActionAddList(organizations, "customId")));
  }
);
