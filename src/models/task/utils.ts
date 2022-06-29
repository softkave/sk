import { defaultTo, first } from "lodash";
import {
  extractFields02,
  getFields02,
  makeExtract02,
  makeListExtract02,
} from "../../utils/extract02";
import { getDateString, indexArray, topLevelDiff } from "../../utils/utils";
import {
  BlockPriority,
  IBlockAssignedLabel,
  ITaskAssignee,
} from "../block/block";
import { IBoard } from "../board/types";
import { ICollaborator as IBlockLabel } from "../collaborator/types";
import { getComplexFieldInput } from "../utils";
import {
  IBlockAssignedLabelInput,
  INewTaskInput,
  ISubTaskInput,
  ITask,
  ITaskAssigneeInput,
  ITaskFormValues,
  ITaskSprintInput,
  IUpdateTaskInput,
} from "./types";

export function newTaskForm(board: IBoard) {
  const newTask: ITaskFormValues = {
    parent: board.customId,
    rootBlockId: board.rootBlockId,
    assignees: [],
    name: "",
    description: "",
    dueAt: undefined,
    priority: BlockPriority.Medium,
    subTasks: [],
    status: first(board.boardStatuses)?.customId,
    labels: [],
  };

  return newTask;
}

const assigneeInputFields = getFields02<ITaskAssigneeInput>(
  { userId: true },
  undefined
);

const subTaskInputFields = getFields02<ISubTaskInput>(
  {
    completedBy: true,
    description: true,
    customId: true,
  },
  undefined
);

const taskLabelInputFields = getFields02<IBlockAssignedLabelInput>(
  { customId: true },
  undefined
);

const taskSprintInputFields = getFields02<ITaskSprintInput>(
  { sprintId: true },
  undefined
);

const assigneeInputExtractor = makeExtract02(assigneeInputFields);
const subTaskInputExtractor = makeExtract02(subTaskInputFields);
const taskLabelInputExtractor = makeExtract02(taskLabelInputFields);
const assigneeListInputExtractor = makeListExtract02(assigneeInputFields);
const subTaskListInputExtractor = makeListExtract02(subTaskInputFields);
const taskLabelListInputExtractor = makeListExtract02(taskLabelInputFields);
const taskSprintInputExtractor = makeExtract02(taskSprintInputFields);

const updateTaskFields = getFields02<
  IUpdateTaskInput,
  ITaskFormValues,
  { task: ITask }
>(
  {
    name: true,
    description: true,
    dueAt: true,
    parent: true,
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
      return getComplexFieldInput<IBlockAssignedLabelInput>(
        args.task.labels || [],
        data,
        "customId",
        (item) => item,
        (item01, item02) => false,
        taskLabelInputExtractor
      );
    },
    taskSprint: taskSprintInputExtractor,
  },
  undefined
);

export function getUpdateTaskInput(
  task: ITask,
  data: Partial<ITaskFormValues>
) {
  const diff = topLevelDiff(data, task);
  return extractFields02(diff, updateTaskFields, { task });
}

const newTaskFields = getFields02<INewTaskInput, ITaskFormValues>(
  {
    name: true,
    description: true,
    dueAt: true,
    parent: true,
    assignees: assigneeListInputExtractor,
    priority: true,
    subTasks: subTaskListInputExtractor,
    status: true,
    taskResolution: true,
    labels: taskLabelListInputExtractor,
    taskSprint: taskSprintInputExtractor,
    rootBlockId: true,
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
  collaborators: IBlockLabel[],
  userId: string,
  existingTask?: ITask,
  isToggleMode = false
): T {
  const currentCollaborators = indexArray(task.assignees, { path: "userId" });
  const existingCollaborators = indexArray(
    defaultTo(existingTask?.assignees, []),
    { path: "userId" }
  );

  const assignees: ITaskAssignee[] = isToggleMode
    ? []
    : [...defaultTo(task.assignees, [])];

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
  labels: IBlockAssignedLabel[],
  userId: string,
  existingTask?: ITask,
  isToggleMode = false
): T {
  const currentLabels = indexArray(task.assignees, { path: "userId" });
  const existingLabels = indexArray(defaultTo(existingTask?.labels, []), {
    path: "customId",
  });

  const update: IBlockAssignedLabel[] = isToggleMode
    ? []
    : [...defaultTo(task.labels, [])];

  labels.forEach((label) => {
    if (!currentLabels[label.customId]) {
      if (existingLabels[label.customId]) {
        update.push(existingLabels[label.customId]);
      } else {
        update.push({
          customId: label.customId,
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
