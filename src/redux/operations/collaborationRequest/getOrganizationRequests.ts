import { ICollaborationRequest } from "../../../models/collaborationRequest/types";
import CollaborationRequestAPI, {
  IGetOrganizationRequestsEndpointParams,
} from "../../../net/collaborationRequest/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import CollaborationRequestActions from "../../collaborationRequests/actions";
import { toActionAddList } from "../../utils";
import OperationType from "../OperationType";
import { makeAsyncOp } from "../utils";

export const getOrganizationRequestsOpAction = makeAsyncOp(
  "op/collaborationRequests/getOrganizationRequests",
  OperationType.GetOrganizationRequests,
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
      CollaborationRequestActions.bulkAdd(toActionAddList(requests, "customId"))
    );
  },
  {
    preFn: (arg) => ({
      resourceId: arg.organizationId,
    }),
  }
);
