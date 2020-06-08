import moment from "moment";
import {
  BlockPriority,
  BlockType,
  IBlock,
  IBlockLabel,
} from "../../models/block/block";
import { getDefaultStatuses } from "../../models/block/utils";
import {
  CollaborationRequestStatusType,
  INotification,
  NotificationType,
} from "../../models/notification/notification";
import { IUser } from "../../models/user/user";
import { getDateString } from "../../utils/utils";

const solomon: IUser = {
  color: "#25b71b",
  createdAt: getDateString(),
  customId: "demo-user-1",
  email: "demo-user-1@softkave.com",
  forgotPasswordHistory: [],
  name: "Ajayi Solomon",
  orgs: [],
  passwordLastChangedAt: getDateString(),
  rootBlockId: "",
};

const abayomi: IUser = {
  color: "#ffd3c6",
  createdAt: getDateString(),
  customId: "demo-user-2",
  email: "demo-user-2@softkave.com",
  forgotPasswordHistory: [],
  name: "Abayomi Akintomide",
  orgs: [],
  passwordLastChangedAt: getDateString(),
  rootBlockId: "",
};

export const demoUsers = {
  solomon,
  abayomi,
};

export const demoOrg: IBlock = {
  createdAt: getDateString(),
  createdBy: "",
  customId: "",
  type: BlockType.Org,
  name: "Softkave",
  color: "#25b71b",
};

export const demoBoard: IBlock = {
  createdAt: getDateString(),
  createdBy: "",
  customId: "",
  type: BlockType.Board,
  name: "Softkave Client Application",
  color: "ffd3c6",
};

export const demoStatuses = getDefaultStatuses(solomon);

const task1: IBlock = {
  createdAt: getDateString(),
  createdBy: "",
  customId: "task-1",
  type: BlockType.Task,
  description: "Build Softkave, an easy-to-use task management application.",
  status: demoStatuses[0].customId,
  priority: BlockPriority.VeryImportant,
};

const task2: IBlock = {
  createdAt: getDateString(),
  createdBy: "",
  customId: "task-2",
  type: BlockType.Task,
  description:
    "Softkave is a work in progress, and will ever be. " +
    "We are ever adding new features, trimming the line, and putting users first. " +
    "There's a lot of work to do, and we'll love to have you on the journey.",
  status: demoStatuses[0].customId,
  priority: BlockPriority.Important,
};

export const demoTasks = [task1, task2];

const label1: IBlockLabel = {
  name: "Feature label",
  description: "Represents a feature",
  createdAt: getDateString(),
  createdBy: solomon.customId,
  customId: "demo-label-one",
  color: "#f28b79",
};

export const demoLabels = { label1 };

export const demoCollaborationRequest: INotification = {
  body: "",
  createdAt: getDateString(),
  customId: "demo-collaboration-request-1",
  to: {
    email: "demo-user-1@softkave.com",
  },
  type: NotificationType.CollaborationRequest,
  statusHistory: [
    { status: CollaborationRequestStatusType.Pending, date: getDateString() },
  ],
  expiresAt: getDateString(moment().add(4, "days")),
};
