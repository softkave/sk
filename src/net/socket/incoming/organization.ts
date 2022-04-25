import { SystemActionType } from "../../../models/app/types";
import { IOrganization } from "../../../models/organization/types";
import { completeCreateOrganization } from "../../../redux/operations/organization/createOrganization";
import { completeUpdateOrganization } from "../../../redux/operations/organization/updateOrganization";
import store from "../../../redux/store";
import { IIncomingResourceUpdatePacket } from "../incomingEventTypes";

function handleCreateOrganization(
  packet: IIncomingResourceUpdatePacket<IOrganization>
) {
  completeCreateOrganization(store, packet.resource);
}

function handleUpdateOrganization(
  packet: IIncomingResourceUpdatePacket<IOrganization>
) {
  completeUpdateOrganization(store, packet.resource);
}

export function handleIncomingOrganizationEvent(
  packet: IIncomingResourceUpdatePacket<IOrganization>
) {
  switch (packet.actionType) {
    case SystemActionType.Create:
      handleCreateOrganization(packet);
      break;
    case SystemActionType.Update:
      handleUpdateOrganization(packet);
      break;
  }
}
