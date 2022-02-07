import { ITask } from "../../models/task/types";
import { getActions } from "../utils";

const TaskActions = getActions<ITask>("task");

export default TaskActions;
