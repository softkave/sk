import { getReducer } from "../utils";
import TaskActions from "./actions";

const tasksReducer = getReducer(TaskActions);

export default tasksReducer;
