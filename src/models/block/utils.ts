import { getDateString, getNewId } from "../../utils/utils";
import { IUser } from "../user/user";
import { BlockType, IBlock, IBlockStatus, ITaskAssignee } from "./block";

export function assignTask(collaborator: IUser, by?: IUser): ITaskAssignee {
  return {
    userId: collaborator.customId,
    assignedAt: getDateString(),
    assignedBy: by ? by.customId : collaborator.customId,
  };
}

type BlockTypeToTypesMap = { [key in BlockType]: BlockType[] };

export function getBlockValidChildrenTypes(type: BlockType): BlockType[] {
  const validChildrenTypesMap: BlockTypeToTypesMap = {
    root: [BlockType.Board],
    org: [BlockType.Board],
    board: [BlockType.Task],
    task: [],
  };

  const types = validChildrenTypesMap[type] || [];
  return [...types];
}

export const getDefaultStatuses = (user: IUser): IBlockStatus[] => {
  return [
    {
      name: "Todo",
      description: "Available tasks",
      createdAt: getDateString(),
      createdBy: user.customId,
      customId: getNewId(),
      color: "#f28b79",
      position: 0,
    },
    {
      name: "In progress",
      description: "Currently being worked on",
      createdAt: getDateString(),
      createdBy: user.customId,
      customId: getNewId(),
      color: "#aa2244",
      position: 1,
    },
    {
      name: "Pending review",
      description: "Completed, pending review",
      createdAt: getDateString(),
      createdBy: user.customId,
      customId: getNewId(),
      color: "#ffd3c6",
      position: 2,
    },
    {
      name: "Done",
      description: "Completed, and reviewed",
      createdAt: getDateString(),
      createdBy: user.customId,
      customId: getNewId(),
      color: "#25b71b",
      position: 3,
    },
  ];
};

export function isTaskInLastStatus(task: IBlock, statusList: IBlockStatus[]) {
  const lastStatus = statusList[statusList.length - 1];
  let isInLastStatus = false;

  if (lastStatus) {
    isInLastStatus = task.status === lastStatus.customId;
  }

  return isInLastStatus;
}
