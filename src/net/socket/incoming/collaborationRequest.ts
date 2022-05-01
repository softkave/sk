import { SystemActionType } from "../../../models/app/types";
import { ICollaborationRequest } from "../../../models/collaborationRequest/types";
import { IResourceWithId } from "../../../models/types";
import { completeAddCollaborationRequests } from "../../../redux/operations/collaborationRequest/addCollaborators";
import { completeDeleteRequest } from "../../../redux/operations/collaborationRequest/deleteRequest";
import { completeUpdateRequest } from "../../../redux/operations/collaborationRequest/updateRequest";
import store from "../../../redux/store";
import { IIncomingResourceUpdatePacket } from "../incomingEventTypes";

function handleCreateCollaborationRequest(
  packet: IIncomingResourceUpdatePacket<ICollaborationRequest>
) {
  completeAddCollaborationRequests(
    store,
    Array.isArray(packet.resource) ? packet.resource : [packet.resource]
  );
}

function handleUpdateCollaborationRequest(
  packet: IIncomingResourceUpdatePacket<ICollaborationRequest>
) {
  completeUpdateRequest(store, packet.resource);
}

function handleDeleteCollaborationRequest(
  packet: IIncomingResourceUpdatePacket<IResourceWithId>
) {
  completeDeleteRequest(store, packet.resource.customId);
}

export function handleIncomingCollaborationRequestEvent(
  packet: IIncomingResourceUpdatePacket<ICollaborationRequest>
) {
  switch (packet.actionType) {
    case SystemActionType.Create:
      handleCreateCollaborationRequest(packet);
      break;
    case SystemActionType.Update:
      handleUpdateCollaborationRequest(packet);
      break;
    case SystemActionType.Delete:
      handleDeleteCollaborationRequest(packet);
      break;
  }
}
