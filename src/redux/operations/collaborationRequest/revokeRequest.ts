import { CollaborationRequestStatusType } from "../../../models/collaborationRequest/types";
import CollaborationRequestAPI, {
  IRevokeRequestEndpointParams,
} from "../../../net/collaborationRequest/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString } from "../../../utils/utils";
import CollaborationRequestSelectors from "../../collaborationRequests/selectors";
import OperationType from "../OperationType";
import { makeAsyncOpWithoutDispatch } from "../utils";
import { completeUpdateRequest } from "./updateRequest";

export const revokeRequestOpAction = makeAsyncOpWithoutDispatch(
  "op/collaborationRequests/revokeRequest",
  OperationType.RevokeRequest,
  async (arg: IRevokeRequestEndpointParams, thunkAPI, extras) => {
    let request = CollaborationRequestSelectors.assertGetOne(
      thunkAPI.getState(),
      arg.requestId
    );

    if (extras.isDemoMode) {
      request = { ...request };
      const statusHistory = [...request.statusHistory];
      statusHistory.push({
        date: getDateString(),
        status: CollaborationRequestStatusType.Revoked,
      });

      request.statusHistory = statusHistory;
    } else {
      const result = await CollaborationRequestAPI.revokeRequest({
        organizationId: arg.organizationId,
        requestId: arg.requestId,
      });

      assertEndpointResult(result);
      request = result.request;
    }

    completeUpdateRequest(thunkAPI, request);
  }
);
