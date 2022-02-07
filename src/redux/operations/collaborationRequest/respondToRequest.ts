import { CollaborationRequestStatusType } from "../../../models/collaborationRequest/types";
import { IAppOrganization } from "../../../models/organization/types";
import { toAppOrganization } from "../../../models/organization/utils";
import CollaborationRequestAPI, {
  IRespondToRequestEndpointParams,
} from "../../../net/collaborationRequest/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString } from "../../../utils/utils";
import CollaborationRequestActions from "../../collaborationRequests/actions";
import CollaborationRequestSelectors from "../../collaborationRequests/selectors";
import OrganizationActions from "../../organizations/actions";
import OrganizationSelectors from "../../organizations/selectors";
import OperationType from "../OperationType";
import { makeAsyncOpWithoutDispatch } from "../utils";

export const respondToRequestOpAction = makeAsyncOpWithoutDispatch(
  "op/collaborationRequests/respondToRequest",
  OperationType.RespondToRequest,
  async (arg: IRespondToRequestEndpointParams, thunkAPI, extras) => {
    let organization: IAppOrganization | null | undefined = null;
    let request = CollaborationRequestSelectors.assertGetOne(
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
      const result = await CollaborationRequestAPI.respondToRequest({
        requestId: arg.requestId,
        response: arg.response,
      });

      assertEndpointResult(result);
      organization = result.organization
        ? toAppOrganization(result.organization)
        : null;

      request = {
        ...request,
        statusHistory: request.statusHistory.concat([
          {
            status: arg.response as CollaborationRequestStatusType,
            date: result.respondedAt,
          },
        ]),
      };
    }

    thunkAPI.dispatch(
      CollaborationRequestActions.update({
        id: request.customId,
        data: request,
        meta: { arrayUpdateStrategy: "replace" },
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
