import { tryGetResourceTypeFromId } from "../../utils/ids";
import { SystemResourceType } from "./types";

export function isRegularUserId(id: string) {
  // TODO: replace with user when we migrate the IDs to the new format
  return tryGetResourceTypeFromId(id) === SystemResourceType.User;
}

export function isDemoUserId(id: string) {
  return tryGetResourceTypeFromId(id) === SystemResourceType.DemoUser;
}

export function isAnonymousUserId(id: string) {
  return tryGetResourceTypeFromId(id) === SystemResourceType.AnonymousUser;
}

export const RESOURCE_TYPE_TO_LABEL_MAP: Record<SystemResourceType, string> = {
  [SystemResourceType.All]: "all resource",
  [SystemResourceType.User]: "user",
  [SystemResourceType.AnonymousUser]: "anonymous user",
  [SystemResourceType.Client]: "client",
  [SystemResourceType.Workspace]: "workspace",
  [SystemResourceType.Board]: "board",
  [SystemResourceType.Task]: "task",
  [SystemResourceType.Status]: "status",
  [SystemResourceType.Label]: "label",
  [SystemResourceType.TaskResolution]: "task resolution",
  [SystemResourceType.Note]: "note",
  [SystemResourceType.Comment]: "comment",
  [SystemResourceType.ChatRoom]: "room",
  [SystemResourceType.Sprint]: "sprint",
  [SystemResourceType.Chat]: "chat",
  [SystemResourceType.SubTask]: "subtask",
  [SystemResourceType.CollaborationRequest]: "collaboration request",
  [SystemResourceType.Notification]: "notification",
  [SystemResourceType.PermissionItem]: "permission item",
  [SystemResourceType.PermissionGroup]: "permission group",
  [SystemResourceType.CustomProperty]: "custom property",
  [SystemResourceType.CustomValue]: "custom value",
  [SystemResourceType.PushSubscription]: "push subscription",

  [SystemResourceType.Temporary]: "temporary",
  [SystemResourceType.DemoUser]: "demo",
};
