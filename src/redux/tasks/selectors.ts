import { ITask } from "../../models/task/types";
import { getSelectors } from "../utils";

const TaskSelectors = getSelectors<ITask>("tasks");

export default TaskSelectors;
