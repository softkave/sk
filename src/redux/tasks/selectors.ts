import { messages } from "../../models/messages";
import { ITask } from "../../models/task/types";
import { IAppState } from "../types";
import { getSelectors } from "../utils";

const TaskSelectors = getSelectors<ITask>("tasks", {
  notFoundMessage: messages.taskNotFound,
});

export default TaskSelectors;
export function getBoardTasks(store: IAppState, boardId: string) {
  return TaskSelectors.filter(store, (item) => item.parent === boardId);
}

export function getSprintTasks(store: IAppState, sprintId: string) {
  return TaskSelectors.filter(
    store,
    (item) => item.taskSprint?.sprintId === sprintId
  );
}
