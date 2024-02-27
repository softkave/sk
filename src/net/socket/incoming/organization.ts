import { SystemActionType } from "../../../models/app/types";
import { IWorkspace } from "../../../models/organization/types";
import { completeStoreOrganization } from "../../../redux/operations/organization/createOrganization";
import { completeUpdateOrganization } from "../../../redux/operations/organization/updateOrganization";
import store from "../../../redux/store";
import { IIncomingResourceUpdatePacket } from "../incomingEventTypes";

function handleCreateOrganization(packet: IIncomingResourceUpdatePacket<IWorkspace>) {
  completeStoreOrganization(store, packet.resource);
}

function handleUpdateOrganization(packet: IIncomingResourceUpdatePacket<IWorkspace>) {
  completeUpdateOrganization(store, packet.resource);
}

export function handleIncomingOrganizationEvent(packet: IIncomingResourceUpdatePacket<IWorkspace>) {
  switch (packet.actionType) {
    case SystemActionType.Create:
      handleCreateOrganization(packet);
      break;
    case SystemActionType.Update:
      handleUpdateOrganization(packet);
      break;
  }
}
