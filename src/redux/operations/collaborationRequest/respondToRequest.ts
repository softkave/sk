import { defaultTo, last, merge } from "lodash";
import {
  CollaborationRequestStatusType,
  ICollaborationRequest,
} from "../../../models/collaborationRequest/types";
import { IAppWorkspace } from "../../../models/organization/types";
import { toAppOrganization } from "../../../models/organization/utils";
import CollaborationRequestAPI, {
  IRespondToRequestEndpointParams,
} from "../../../net/collaborationRequest/endpoints";
import OrganizationAPI from "../../../net/organization/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString, indexArray } from "../../../utils/utils";
import CollaborationRequestSelectors from "../../collaborationRequests/selectors";
import OrganizationActions from "../../organizations/actions";
import OrganizationSelectors from "../../organizations/selectors";
import { IStoreLikeObject } from "../../types";
import { toActionAddList } from "../../utils";
import { completeStoreOrganization } from "../organization/createOrganization";
import { makeAsyncOp02NoPersist } from "../utils";
import { completeUpdateRequest } from "./updateRequest";

export const respondToRequestOpAction = makeAsyncOp02NoPersist(
  "op/collaborationRequests/respondToRequest",
  async (arg: IRespondToRequestEndpointParams, thunkAPI, extras) => {
    let organization: IAppWorkspace | null | undefined = null;
    let request = CollaborationRequestSelectors.assertGetOne(thunkAPI.getState(), arg.requestId);
    if (extras.isDemoMode) {
      request = { ...request };
      request.statusHistory.push({
        date: getDateString(),
        status: arg.response as CollaborationRequestStatusType,
      });

      organization =
        arg.response === CollaborationRequestStatusType.Accepted
          ? OrganizationSelectors.assertGetOne(thunkAPI.getState(), request.from.workspaceId)
          : null;
    } else {
      const result = await CollaborationRequestAPI.respondToRequest({
        requestId: arg.requestId,
        response: arg.response,
      });

      assertEndpointResult(result);
      organization = result.organization ? toAppOrganization(result.organization) : null;
      request = result.request;
    }

    await completeRespondToRequest(thunkAPI, request, organization);
  }
);

export async function completeRespondToRequest(
  thunkAPI: IStoreLikeObject,
  request: ICollaborationRequest,
  organization?: IAppWorkspace | null
) {
  completeUpdateRequest(thunkAPI, request);
  const status = last(request.statusHistory);

  if (organization) {
    completeStoreOrganization(thunkAPI, organization);
  } else if (status && status.status === CollaborationRequestStatusType.Accepted) {
    const result = await OrganizationAPI.getUserOrganizations();
    assertEndpointResult(result);
    const organizationsMap = indexArray(OrganizationSelectors.getAll(thunkAPI.getState()), {
      path: "customId",
    });

    const organizations = result.organizations.map((item) =>
      merge(toAppOrganization(item), defaultTo(organizationsMap[item.customId], {}))
    );

    thunkAPI.dispatch(OrganizationActions.replace(toActionAddList(organizations, "customId")));
  }
}
