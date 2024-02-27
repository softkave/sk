import { ICollaborationRequest } from "../../../models/collaborationRequest/types";
import CollaborationRequestActions from "../../collaborationRequests/actions";
import { IStoreLikeObject } from "../../types";

export function completeUpdateRequest(thunkAPI: IStoreLikeObject, request: ICollaborationRequest) {
  thunkAPI.dispatch(
    CollaborationRequestActions.update({
      id: request.customId,
      data: request,
      meta: { arrayUpdateStrategy: "replace" },
    })
  );
}
