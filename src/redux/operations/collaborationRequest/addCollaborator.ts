import { BlockType } from "../../../models/block/block";
import {
    CollaborationRequestStatusType,
    ICollaborationRequest,
} from "../../../models/collaborationRequest/types";
import CollaborationRequestAPI, {
    IAddCollaboratorsEndpointParams,
} from "../../../net/collaborationRequest/endpoints";
import { assertEndpointResult } from "../../../net/utils";
import { getDateString, getNewId } from "../../../utils/utils";
import CollaborationRequestActions from "../../collaborationRequests/actions";
import OrganizationSelectors from "../../organizations/selectors";
import SessionSelectors from "../../session/selectors";
import { toActionAddList } from "../../utils";
import OperationType from "../OperationType";
import { makeAsyncOpWithoutDispatch } from "../utils";

export const addCollaboratorOpAction = makeAsyncOpWithoutDispatch(
    "op/collaborationRequests/addCollaborator",
    OperationType.AddCollaborators,
    async (arg: IAddCollaboratorsEndpointParams, thunkAPI, extras) => {
        let requests: ICollaborationRequest[] = [];
        const user = SessionSelectors.assertGetUser(thunkAPI.getState());
        const organization = OrganizationSelectors.getOne(
            thunkAPI.getState(),
            arg.organizationId
        );

        if (extras.isDemoMode) {
            requests = arg.collaborators.map((item) => ({
                customId: getNewId(),
                to: {
                    email: item.email,
                },
                title: "New collaboration request from " + organization.name,
                body: "",
                from: {
                    blockId: organization.customId,
                    blockName: organization.name,
                    blockType: BlockType.Organization,
                    name: user.name,
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
            }));
        } else {
            const result = await CollaborationRequestAPI.addCollaborators(arg);
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
