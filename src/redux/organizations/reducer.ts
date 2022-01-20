import { getReducer } from "../utils";
import OrganizationActions from "./actions";

const organizationsReducer = getReducer(OrganizationActions);

export default organizationsReducer;
