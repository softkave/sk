import CollaborationRequestAPI, {
  IMarkRequestReadEndpointParams,
} from "../../../net/collaborationRequest/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString } from "../../../utils/utils";
import CollaborationRequestActions from "../../collaborationRequests/actions";
import CollaborationRequestSelectors from "../../collaborationRequests/selectors";
import OperationType from "../OperationType";
import { makeAsyncOpWithoutDispatch } from "../utils";

export const markRequestReadOpAction = makeAsyncOpWithoutDispatch(
  "op/collaborationRequests/markRequestRead",
  OperationType.MarkRequestRead,
  async (arg: IMarkRequestReadEndpointParams, thunkAPI, extras) => {
    let request = CollaborationRequestSelectors.assertGetOne(
      thunkAPI.getState(),
      arg.requestId
    );

    if (extras.isDemoMode) {
      request = { ...request, readAt: getDateString() };
    } else {
      const result = await CollaborationRequestAPI.markRequestRead({
        requestId: arg.requestId,
      });
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
