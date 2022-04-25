import assert from "assert";
import { SystemResourceType } from "../../../models/app/types";
import { IIncomingResourceUpdatePacket } from "../incomingEventTypes";
import { getSocketRoomInfo } from "../roomNameHelpers";
import { handleIncomingBoardEvent } from "./board";
import { handleIncomingChatEvent } from "./chat";
import { handleIncomingCollaborationRequestEvent } from "./collaborationRequest";
import { handleIncomingCollaboratorEvent } from "./collaborator";
import { handleIncomingOrganizationEvent } from "./organization";
import { handleIncomingRoomEvent } from "./room";
import { handleIncomingSprintEvent } from "./sprint";
import { handleIncomingTaskEvent } from "./task";
import { handleIncomingUserEvent } from "./user";

export function handleResourceUpdateEvent(
  packet: IIncomingResourceUpdatePacket<any>
) {
  const room = getSocketRoomInfo(packet.roomName);
  assert(room, "roomName is not valid");
  switch (packet.resourceType) {
    case SystemResourceType.User:
      return handleIncomingUserEvent(packet);
    case SystemResourceType.Collaborator:
      return handleIncomingCollaboratorEvent(packet, room);
    case SystemResourceType.Org:
      return handleIncomingOrganizationEvent(packet);
    case SystemResourceType.Board:
      return handleIncomingBoardEvent(packet);
    case SystemResourceType.Task:
      return handleIncomingTaskEvent(packet);
    case SystemResourceType.Room:
      return handleIncomingRoomEvent(packet);
    case SystemResourceType.Sprint:
      return handleIncomingSprintEvent(packet);
    case SystemResourceType.Chat:
      return handleIncomingChatEvent(packet);
    case SystemResourceType.CollaborationRequest:
      return handleIncomingCollaborationRequestEvent(packet);
  }
}
