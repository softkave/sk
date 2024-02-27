import CollaborationRequestAPI, {
  IMarkRequestReadEndpointParams,
} from "../../../net/collaborationRequest/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString } from "../../../utils/utils";
import CollaborationRequestSelectors from "../../collaborationRequests/selectors";
import { makeAsyncOp02NoPersist } from "../utils";
import { completeUpdateRequest } from "./updateRequest";

export const markRequestReadOpAction = makeAsyncOp02NoPersist(
  "op/collaborationRequests/markRequestRead",
  async (arg: IMarkRequestReadEndpointParams, thunkAPI, extras) => {
    let request = CollaborationRequestSelectors.assertGetOne(thunkAPI.getState(), arg.requestId);
    if (extras.isDemoMode) {
      request = { ...request, readAt: getDateString() };
    } else {
      const result = await CollaborationRequestAPI.markRequestRead({
        requestId: arg.requestId,
      });
      assertEndpointResult(result);
      request = result.request;
    }

    completeUpdateRequest(thunkAPI, request);
  }
);
