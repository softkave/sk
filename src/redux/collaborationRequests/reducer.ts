import { getReducer } from "../utils";
import collaborationRequestActions from "./actions";

const collaborationRequestsReducer = getReducer(collaborationRequestActions);

export default collaborationRequestsReducer;
