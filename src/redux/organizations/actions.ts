import { IAppWorkspace } from "../../models/organization/types";
import { getActions } from "../utils";

const OrganizationActions = getActions<IAppWorkspace>("organization");

export default OrganizationActions;
