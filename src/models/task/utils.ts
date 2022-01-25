import { last } from "lodash";
import { ITaskFormValues } from "../../components/task/TaskForm";
import { extractFields, getFields, makeExtract } from "../../utils/extract";
import { topLevelDiff } from "../../utils/utils";
import { BlockPriority } from "../block/block";
import { IBoard } from "../board/types";
import { getComplexFieldInput } from "../utils";
import {
  IAssigneeInput,
  IBlockAssignedLabelInput,
  INewTaskInput,
  ISubTaskInput,
  ITask,
  ITaskSprintInput,
  IUpdateTaskInput,
} from "./types";

export function newTaskForm(board: IBoard) {
  const newTask: INewTaskInput = {
    parent: board.customId,
    rootBlockId: board.rootBlockId,
    assignees: [],
    name: "",
    description: "",
    dueAt: undefined,
    priority: BlockPriority.High,
    subTasks: [],
    status: last(board.boardStatuses)?.customId,
    labels: [],
  };

  return newTask;
}

const assigneeInputFields = getFields<IAssigneeInput>({
  userId: true,
});

const subTaskInputFields = getFields<ISubTaskInput>({
  completedBy: true,
  description: true,
  customId: true,
});

const taskLabelInputFields = getFields<IBlockAssignedLabelInput>({
  customId: true,
});

const taskSprintInputFields = getFields<ITaskSprintInput>({
  sprintId: true,
});

const assigneeInputExtractor = makeExtract(assigneeInputFields);
const subTaskInputExtractor = makeExtract(subTaskInputFields);
const taskLabelInputExtractor = makeExtract(taskLabelInputFields);
const taskSprintInputExtractor = makeExtract(taskSprintInputFields);

const updateBlockFields = getFields<
  ITaskFormValues,
  IUpdateTaskInput,
  { task: ITask }
>({
  name: true,
  description: true,
  dueAt: true,
  parent: true,
  rootBlockId: true,
  assignees: (data, args) => {
    return getComplexFieldInput(
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
    return getComplexFieldInput(
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
    return getComplexFieldInput(
      args.task.labels || [],
      data,
      "customId",
      (item) => item,
      (item01, item02) => false,
      taskLabelInputExtractor
    );
  },
  taskSprint: taskSprintInputExtractor,
});

export function getUpdateTaskInput(
  task: ITask,
  data: Partial<ITaskFormValues>
) {
  const diff = topLevelDiff(data, task);
  return extractFields(diff, updateBlockFields, { task });
}
