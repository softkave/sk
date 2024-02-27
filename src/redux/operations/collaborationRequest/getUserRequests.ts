import { ICollaborationRequest } from "../../../models/collaborationRequest/types";
import CollaborationRequestAPI from "../../../net/collaborationRequest/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import CollaborationRequestActions from "../../collaborationRequests/actions";
import { toActionAddList } from "../../utils";
import { makeAsyncOp02 } from "../utils";

export const getUserRequestsOpAction = makeAsyncOp02(
  "op/collaborationRequests/getUserRequests",
  async (arg: {}, thunkAPI, extras) => {
    let requests: ICollaborationRequest[] = [];
    if (!extras.isDemoMode && !extras.isAnonymousUser) {
      const result = await CollaborationRequestAPI.getUserRequests();
      assertEndpointResult(result);
      requests = result.requests;
    }

    thunkAPI.dispatch(
      CollaborationRequestActions.bulkUpdate(toActionAddList(requests, "customId"))
    );
  }
);
