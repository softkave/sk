import { ICollaborationRequest } from "../../../models/collaborationRequest/types";
import CollaborationRequestAPI from "../../../net/collaborationRequest/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import CollaborationRequestActions from "../../collaborationRequests/actions";
import { toActionAddList } from "../../utils";
import OperationType from "../OperationType";
import { makeAsyncOp } from "../utils";

export const getUserRequestsOpAction = makeAsyncOp(
  "op/collaborationRequests/getUserRequests",
  OperationType.GetUserRequests,
  async (arg: undefined, thunkAPI, extras) => {
    let requests: ICollaborationRequest[] = [];

    if (extras.isDemoMode) {
    } else {
      const result = await CollaborationRequestAPI.getUserRequests();
      assertEndpointResult(result);
      requests = result.requests;
    }

    thunkAPI.dispatch(
      CollaborationRequestActions.bulkAdd(toActionAddList(requests, "customId"))
    );
  }
);
