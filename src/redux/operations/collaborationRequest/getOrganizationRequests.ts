import { ICollaborationRequest } from "../../../models/collaborationRequest/types";
import CollaborationRequestAPI, {
    IGetOrganizationRequestsEndpointParams,
} from "../../../net/collaborationRequest/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import CollaborationRequestActions from "../../collaborationRequests/actions";
import { toActionAddList } from "../../utils";
import OperationType from "../OperationType";
import { makeAsyncOpWithoutDispatch } from "../utils";

export const getOrganizationRequestsOpAction = makeAsyncOpWithoutDispatch(
    "op/collaborationRequests/getOrganizationRequests",
    OperationType.GetOrganizationRequests,
    async (arg: IGetOrganizationRequestsEndpointParams, thunkAPI, extras) => {
        let requests: ICollaborationRequest[] = [];

        if (extras.isDemoMode) {
        } else {
            const result =
                await CollaborationRequestAPI.getOrganizationRequests(arg);
            assertEndpointResult(result);
            requests = result.requests;
        }

        thunkAPI.dispatch(
            CollaborationRequestActions.bulkAdd(
                toActionAddList(requests, "customId")
            )
        );
    }
);
