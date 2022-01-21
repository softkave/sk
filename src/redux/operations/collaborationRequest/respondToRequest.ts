import { CollaborationRequestStatusType } from "../../../models/collaborationRequest/types";
import { IOrganization } from "../../../models/organization/types";
import CollaborationRequestAPI, {
    IRespondToRequestEndpointParams,
} from "../../../net/collaborationRequest/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString } from "../../../utils/utils";
import CollaborationRequestActions from "../../collaborationRequests/actions";
import collaborationRequestSelectors from "../../collaborationRequests/selectors";
import OrganizationActions from "../../organizations/actions";
import OrganizationSelectors from "../../organizations/selectors";
import OperationType from "../OperationType";
import { makeAsyncOpWithoutDispatch } from "../utils";

export const respondToRequestOpAction = makeAsyncOpWithoutDispatch(
    "op/collaborationRequests/respondToRequest",
    OperationType.RespondToRequest,
    async (arg: IRespondToRequestEndpointParams, thunkAPI, extras) => {
        let organization: IOrganization | null | undefined = null;
        let request = collaborationRequestSelectors.assertGetOne(
            thunkAPI.getState(),
            arg.requestId
        );

        if (extras.isDemoMode) {
            request = { ...request };
            request.statusHistory.push({
                date: getDateString(),
                status: arg.response as CollaborationRequestStatusType,
            });

            organization =
                arg.response === CollaborationRequestStatusType.Accepted
                    ? OrganizationSelectors.assertGetOne(
                          thunkAPI.getState(),
                          request.from.blockId
                      )
                    : null;
        } else {
            const result = await CollaborationRequestAPI.respondToRequest(arg);
            assertEndpointResult(result);
            organization = result.organization;
            request = {
                ...request,
                readAt: result.respondedAt,
            };
        }

        thunkAPI.dispatch(
            CollaborationRequestActions.update({
                id: request.customId,
                data: request,
            })
        );

        if (organization) {
            thunkAPI.dispatch(
                OrganizationActions.add({
                    id: organization.customId,
                    data: organization,
                })
            );
        }
    }
);
