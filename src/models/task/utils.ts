import { defaultTo, first } from "lodash";
import {
  extractFields02,
  getFields02,
  makeExtract02,
  makeExtractIfPresent02,
  makeListExtract02,
} from "../../utils/extract02";
import { getNewId } from "../../utils/ids";
import { getDateString, indexArray, topLevelDiff } from "../../utils/utils";
import { IBoard, IBoardStatus } from "../board/types";
import { sortStatusList } from "../board/utils";
import { ICollaborator as IBoardLabel } from "../collaborator/types";
import { IUser } from "../user/types";
import { getComplexFieldInput } from "../utils";
import {
  INewTaskInput,
  ISubTaskInput,
  ITask,
  ITaskAssignedLabel,
  ITaskAssignedLabelInput,
  ITaskAssignee,
  ITaskAssigneeInput,
  ITaskFormValues,
  ITaskSprintInput,
  IUpdateTaskInput,
  TaskPriority,
} from "./types";

export function newTaskForm(board: IBoard) {
  const newTask: ITaskFormValues = {
    boardId: board.customId,
    workspaceId: board.workspaceId,
    assignees: [],
    name: "",
    description: "",
    dueAt: undefined,
    priority: TaskPriority.Medium,
    subTasks: [],
    status: first(sortStatusList(board.boardStatuses))?.customId,
    labels: [],
  };

  return newTask;
}

const assigneeInputFields = getFields02<ITaskAssigneeInput>({ userId: true }, undefined);

const subTaskInputFields = getFields02<ISubTaskInput>(
  {
    completedBy: true,
    description: true,
    customId: true,
  },
  undefined
);

const taskLabelInputFields = getFields02<ITaskAssignedLabelInput>({ labelId: true }, undefined);

const taskSprintInputFields = getFields02<ITaskSprintInput>({ sprintId: true }, undefined);

const assigneeInputExtractor = makeExtract02(assigneeInputFields);
const subTaskInputExtractor = makeExtract02(subTaskInputFields);
const taskLabelInputExtractor = makeExtract02(taskLabelInputFields);
const assigneeListInputExtractor = makeListExtract02(assigneeInputFields);
const subTaskListInputExtractor = makeListExtract02(subTaskInputFields);
const taskLabelListInputExtractor = makeListExtract02(taskLabelInputFields);

const updateTaskFields = getFields02<IUpdateTaskInput, ITaskFormValues, { task: ITask }>(
  {
    name: true,
    description: true,
    dueAt: true,
    boardId: true,
    assignees: (data, args) => {
      return getComplexFieldInput<ITaskAssigneeInput>(
        args.task.assignees || [],
        data,
        "userId",
        (item) => item,
        (item01, item02) => false,
        assigneeInputExtractor
      );
    },
    priority: true,
    subTasks: (data, args) => {
      return getComplexFieldInput<ISubTaskInput>(
        args.task.subTasks || [],
        data,
        "customId",
        (item) => ({
          ...item,
          description: item.description.toLowerCase(),
        }),
        (item01, item02) =>
          item02.description.toLowerCase() !== item01.description ||
          item02.completedBy !== item01.completedBy,
        subTaskInputExtractor
      );
    },
    status: true,
    taskResolution: true,
    labels: (data, args) => {
      return getComplexFieldInput<ITaskAssignedLabelInput>(
        args.task.labels || [],
        data,
        "labelId",
        (item) => item,
        (item01, item02) => false,
        taskLabelInputExtractor
      );
    },
    taskSprint: makeExtractIfPresent02(taskSprintInputFields),
  },
  undefined
);

export function getUpdateTaskInput(task: ITask, data: Partial<ITaskFormValues>) {
  const diff = topLevelDiff(data, task);
  return extractFields02(diff, updateTaskFields, { task });
}

const newTaskFields = getFields02<INewTaskInput, ITaskFormValues>(
  {
    name: true,
    description: true,
    dueAt: true,
    boardId: true,
    assignees: assigneeListInputExtractor,
    priority: true,
    subTasks: subTaskListInputExtractor,
    status: true,
    taskResolution: true,
    labels: taskLabelListInputExtractor,
    taskSprint: makeExtract02(taskSprintInputFields),
    workspaceId: true,
  },
  undefined
);

export function getNewTaskInput(data: Partial<ITaskFormValues>) {
  return extractFields02(data, newTaskFields, undefined);
}

export function assignStatus<T extends Partial<ITaskFormValues>>(
  task: T,
  statusId: string,
  userId: string,
  existingTask?: ITask
): T {
  if (statusId === existingTask?.status) {
    return {
      ...task,
      status: existingTask.status,
      statusAssignedAt: existingTask.statusAssignedAt,
      statusAssignedBy: existingTask.statusAssignedBy,
    };
  } else {
    return {
      ...task,
      status: statusId,
      statusAssignedAt: getDateString(),
      statusAssignedBy: userId,
    };
  }
}

export const TASKS_BACKLOG = "Backlog";
export function assignSprint<T extends Partial<ITaskFormValues>>(
  task: T,
  sprintId: string,
  userId: string,
  existingTask?: ITask
): T {
  if (sprintId === TASKS_BACKLOG) {
    return {
      ...task,
      taskSprint: null,
    };
  } else if (sprintId === existingTask?.taskSprint?.sprintId) {
    return {
      ...task,
      taskSprint: existingTask.taskSprint,
    };
  } else {
    return {
      ...task,
      taskSprint: {
        sprintId,
        assignedAt: getDateString(),
        assignedBy: userId,
      },
    };
  }
}

export function assignCollaborators<T extends Partial<ITaskFormValues>>(
  task: T,
  collaborators: IBoardLabel[],
  userId: string,
  existingTask?: ITask,
  isToggleMode = false
): T {
  const currentCollaborators = indexArray(task.assignees, { path: "userId" });
  const existingCollaborators = indexArray(defaultTo(existingTask?.assignees, []), {
    path: "userId",
  });

  const assignees: ITaskAssignee[] = isToggleMode ? [] : [...defaultTo(task.assignees, [])];

  collaborators.forEach((collaborator) => {
    if (!currentCollaborators[collaborator.customId]) {
      if (existingCollaborators[collaborator.customId]) {
        assignees.push(existingCollaborators[collaborator.customId]);
      } else {
        assignees.push({
          userId: collaborator.customId,
          assignedAt: getDateString(),
          assignedBy: userId,
        });
      }
    }
  });

  return {
    ...task,
    assignees,
  };
}

export function assignLabels<T extends Partial<ITaskFormValues>>(
  task: T,
  labels: ITaskAssignedLabel[],
  userId: string,
  existingTask?: ITask,
  isToggleMode = false
): T {
  const currentLabels = indexArray(task.assignees, { path: "userId" });
  const existingLabels = indexArray(defaultTo(existingTask?.labels, []), {
    path: "labelId",
  });

  const update: ITaskAssignedLabel[] = isToggleMode ? [] : [...defaultTo(task.labels, [])];

  labels.forEach((label) => {
    if (!currentLabels[label.labelId]) {
      if (existingLabels[label.labelId]) {
        update.push(existingLabels[label.labelId]);
      } else {
        update.push({
          labelId: label.labelId,
          assignedAt: getDateString(),
          assignedBy: userId,
        });
      }
    }
  });

  return {
    ...task,
    assignees: update,
  };
}

export function assignTask(collaborator: IUser, by?: IUser): ITaskAssignee {
  return {
    userId: collaborator.customId,
    assignedAt: getDateString(),
    assignedBy: by ? by.customId : collaborator.customId,
  };
}

export const getDefaultStatuses = (user: IUser): IBoardStatus[] => {
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

export function isTaskInLastStatus(task: ITask, statusList: IBoardStatus[]) {
  const lastStatus = statusList[statusList.length - 1];
  let isInLastStatus = false;

  if (lastStatus) {
    isInLastStatus = task.status === lastStatus.customId;
  }

  return isInLastStatus;
}
