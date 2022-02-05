import { CollaborationRequestStatusType } from "../../../models/collaborationRequest/types";
import CollaborationRequestAPI, {
  IRevokeRequestEndpointParams,
} from "../../../net/collaborationRequest/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString } from "../../../utils/utils";
import CollaborationRequestActions from "../../collaborationRequests/actions";
import CollaborationRequestSelectors from "../../collaborationRequests/selectors";
import OperationType from "../OperationType";
import { makeAsyncOpWithoutDispatch } from "../utils";

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
      const result = await CollaborationRequestAPI.revokeRequest(arg);
      assertEndpointResult(result);
      request = result.request;
    }

    thunkAPI.dispatch(
      CollaborationRequestActions.update({
        id: request.customId,
        data: request,
        meta: { arrayUpdateStrategy: "replace" },
      })
    );
  }
);
