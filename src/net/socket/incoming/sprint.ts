import { SystemActionType } from "../../../models/app/types";
import { ISprint } from "../../../models/sprint/types";
import { IResourceWithId } from "../../../models/types";
import { completeAddSprint } from "../../../redux/operations/sprint/addSprint";
import { completeDeleteSprint } from "../../../redux/operations/sprint/deleteSprint";
import { completeUpdateSprint } from "../../../redux/operations/sprint/updateSprint";
import store from "../../../redux/store";
import { IIncomingResourceUpdatePacket } from "../incomingEventTypes";

function handleCreateSprint(packet: IIncomingResourceUpdatePacket<ISprint>) {
  completeAddSprint(store, packet.resource);
}

function handleUpdateSprint(packet: IIncomingResourceUpdatePacket<ISprint>) {
  completeUpdateSprint(store, packet.resource);
}

function handleDeleteSprint(
  packet: IIncomingResourceUpdatePacket<IResourceWithId>
) {
  completeDeleteSprint(store, packet.resource.customId);
}

export function handleIncomingSprintEvent(
  packet: IIncomingResourceUpdatePacket<ISprint>
) {
  switch (packet.actionType) {
    case SystemActionType.Create:
      handleCreateSprint(packet);
      break;
    case SystemActionType.Update:
      handleUpdateSprint(packet);
      break;
    case SystemActionType.Delete:
      handleDeleteSprint(packet);
      break;
  }
}
