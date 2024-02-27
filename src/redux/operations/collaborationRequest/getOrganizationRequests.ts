import { ICollaborationRequest } from "../../../models/collaborationRequest/types";
import CollaborationRequestAPI, {
  IGetOrganizationRequestsEndpointParams,
} from "../../../net/collaborationRequest/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import CollaborationRequestActions from "../../collaborationRequests/actions";
import { toActionAddList } from "../../utils";
import { makeAsyncOp02 } from "../utils";

export const getOrganizationRequestsOpAction = makeAsyncOp02(
  "op/collaborationRequests/getOrganizationRequests",
  async (arg: IGetOrganizationRequestsEndpointParams, thunkAPI, extras) => {
    let requests: ICollaborationRequest[] = [];
    if (!extras.isDemoMode) {
      const result = await CollaborationRequestAPI.getOrganizationRequests({
        organizationId: arg.organizationId,
      });

      assertEndpointResult(result);
      requests = result.requests;
    }

    thunkAPI.dispatch(
      CollaborationRequestActions.bulkUpdate(toActionAddList(requests, "customId"))
    );
  }
);
