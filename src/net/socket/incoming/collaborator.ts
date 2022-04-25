import assert from "assert";
import {
  SystemActionType,
  SystemResourceType,
} from "../../../models/app/types";
import { ICollaborator } from "../../../models/collaborator/types";
import { messages } from "../../../models/messages";
import { IRoomLikeResource } from "../../../redux/key-value/types";
import { completeAddCollaborator } from "../../../redux/operations/collaborator/addCollaborator";
import { completeRemoveCollaborator } from "../../../redux/operations/collaborator/removeCollaborator";
import { completeUpdateCollaborator } from "../../../redux/operations/collaborator/updateCollaborator";
import store from "../../../redux/store";
import { IIncomingResourceUpdatePacket } from "../incomingEventTypes";

function handleCreateCollaborator(
  packet: IIncomingResourceUpdatePacket<ICollaborator>,
  room: IRoomLikeResource
) {
  completeAddCollaborator(store, packet.resource, room.customId);
}

function handleUpdateCollaborator(
  packet: IIncomingResourceUpdatePacket<ICollaborator>
) {
  completeUpdateCollaborator(store, packet.resource);
}

function handleDeleteCollaborator(
  packet: IIncomingResourceUpdatePacket<{
    customId: string;
  }>,
  room: IRoomLikeResource
) {
  // TODO: add more useful info to the message or log it
  assert(room.type === SystemResourceType.Org, messages.internalError);
  completeRemoveCollaborator(store, room.customId, packet.resource.customId);
}

export function handleIncomingCollaboratorEvent(
  packet: IIncomingResourceUpdatePacket<any>,
  room: IRoomLikeResource
) {
  switch (packet.actionType) {
    case SystemActionType.Create:
      handleCreateCollaborator(packet, room);
      break;
    case SystemActionType.Update:
      handleUpdateCollaborator(packet);
      break;
    case SystemActionType.Delete:
      handleDeleteCollaborator(packet, room);
      break;
  }
}
