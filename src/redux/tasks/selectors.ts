import { appMessages } from "../../models/messages";
import { ITask } from "../../models/task/types";
import { IAppState } from "../types";
import { getSelectors } from "../utils";

const TaskSelectors_ = getSelectors<ITask>("tasks", {
  notFoundMessage: appMessages.taskNotFound,
});

function getBoardTasks(store: IAppState, boardId: string) {
  return TaskSelectors_.filter(store, (item) => item.boardId === boardId);
}

function getSprintTasks(store: IAppState, sprintId: string) {
  return TaskSelectors_.filter(store, (item) => item.taskSprint?.sprintId === sprintId);
}

class TaskSelectors extends TaskSelectors_ {
  static getBoardTasks = getBoardTasks;
  static getSprintTasks = getSprintTasks;
}

export default TaskSelectors;
