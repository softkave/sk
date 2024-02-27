import { getReducer } from "../utils";
import UserActions from "./actions";

const usersReducer = getReducer(UserActions);

export default usersReducer;
