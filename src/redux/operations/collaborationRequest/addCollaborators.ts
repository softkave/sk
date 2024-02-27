import assert from "assert";
import {
  CollaborationRequestStatusType,
  ICollaborationRequest,
} from "../../../models/collaborationRequest/types";
import CollaborationRequestAPI, {
  IAddCollaboratorsEndpointParams,
} from "../../../net/collaborationRequest/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import { getNewId } from "../../../utils/ids";
import { getDateString } from "../../../utils/utils";
import CollaborationRequestActions from "../../collaborationRequests/actions";
import OrganizationSelectors from "../../organizations/selectors";
import SessionSelectors from "../../session/selectors";
import { IStoreLikeObject } from "../../types";
import { toActionAddList } from "../../utils";
import { makeAsyncOp02NoPersist } from "../utils";

export const addCollaboratorsOpAction = makeAsyncOp02NoPersist(
  "op/collaborationRequests/addCollaborators",
  async (arg: IAddCollaboratorsEndpointParams, thunkAPI, extras) => {
    let requests: ICollaborationRequest[] = [];
    const user = SessionSelectors.assertGetUser(thunkAPI.getState());
    const organization = OrganizationSelectors.getOne(thunkAPI.getState(), arg.organizationId);
    if (extras.isDemoMode) {
      assert(organization, "organization should exist");
      requests = arg.collaborators.map((item) => ({
        customId: getNewId(),
        to: { email: item.email },
        title: "New collaboration request from " + organization.name,
        body: "",
        from: {
          workspaceId: organization.customId,
          workspaceName: organization.name,
          userName: user.firstName,
          userId: user.customId,
        },
        createdAt: getDateString(),
        statusHistory: [
          {
            date: getDateString(),
            status: CollaborationRequestStatusType.Pending,
          },
        ],
        sentEmailHistory: [],
        visibility: "organization",
        workspaceId: organization.customId,
        createdBy: user.customId,
      }));
    } else {
      const result = await CollaborationRequestAPI.addCollaborators({
        collaborators: arg.collaborators,
        organizationId: arg.organizationId,
      });
      assertEndpointResult(result);
      requests = result.requests;
    }

    completeAddCollaborationRequests(thunkAPI, requests);
  }
);

export function completeAddCollaborationRequests(
  thunkAPI: IStoreLikeObject,
  requests: ICollaborationRequest[]
): void {
  thunkAPI.dispatch(CollaborationRequestActions.bulkUpdate(toActionAddList(requests, "customId")));
}
