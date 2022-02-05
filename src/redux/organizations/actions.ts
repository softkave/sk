import { IAppOrganization } from "../../models/organization/types";
import { getActions } from "../utils";

const OrganizationActions = getActions<IAppOrganization>("organization");

export default OrganizationActions;
