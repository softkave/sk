import { reverseMap } from "../../utils/utils";
import { SystemResourceType } from "./types";

export const appConstants = {
  complaintEmailAddress: "abayomi@softkave.com",
  appShortName: "boards",
  demoQueryKey: "isDemo",
  demoUserEmail: "boards-demo-user@softkave.com",
  demoUserFirstName: "Demo",
  demoUserLastName: "User",
  maxPageSize: 100,
  maxNameLength: 100,
  maxDescriptionLength: 300,
};

export const resourceTypeShortNameMaxLen = 7;
function padShortName(shortName: string) {
  const pad0 = "0";
  if (shortName.length > resourceTypeShortNameMaxLen) {
    throw new Error(`Resource short name is more than ${resourceTypeShortNameMaxLen} characters`);
  }
  return shortName.padEnd(resourceTypeShortNameMaxLen, pad0).toLowerCase();
}

export const resourceTypeShortNames: Record<SystemResourceType, string> = {
  [SystemResourceType.All]: padShortName("*"),
  [SystemResourceType.Workspace]: padShortName("wrkspce"),
  [SystemResourceType.PermissionGroup]: padShortName("pmgroup"),
  [SystemResourceType.User]: padShortName("user"),
  [SystemResourceType.AnonymousUser]: padShortName("anymusr"),
  [SystemResourceType.Client]: padShortName("client"),
  [SystemResourceType.Board]: padShortName("board"),
  [SystemResourceType.Task]: padShortName("task"),
  [SystemResourceType.Status]: padShortName("status"),
  [SystemResourceType.Label]: padShortName("label"),
  [SystemResourceType.TaskResolution]: padShortName("tskrsln"),
  [SystemResourceType.Note]: padShortName("note"),
  [SystemResourceType.Comment]: padShortName("commnt"),
  [SystemResourceType.ChatRoom]: padShortName("chtroom"),
  [SystemResourceType.Sprint]: padShortName("sprnt"),
  [SystemResourceType.Chat]: padShortName("chat"),
  [SystemResourceType.SubTask]: padShortName("sbtask"),
  [SystemResourceType.CollaborationRequest]: padShortName("corqst"),
  [SystemResourceType.Notification]: padShortName("notftn"),
  [SystemResourceType.CustomProperty]: padShortName("cstmpty"),
  [SystemResourceType.CustomValue]: padShortName("cstmval"),
  [SystemResourceType.PushSubscription]: padShortName("pushsub"),
  [SystemResourceType.PermissionItem]: padShortName("permitm"),

  [SystemResourceType.Temporary]: padShortName("temp"),
  [SystemResourceType.DemoUser]: padShortName("demo"),
};

export const shortNameToResourceTypeMap = reverseMap(resourceTypeShortNames);
