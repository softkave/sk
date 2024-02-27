import CollaborationRequestActions from "../../collaborationRequests/actions";
import { IStoreLikeObject } from "../../types";

export function completeDeleteRequest(thunkAPI: IStoreLikeObject, requestId: string) {
  thunkAPI.dispatch(CollaborationRequestActions.remove(requestId));
}
