import { IOrganization } from "../../models/organization/types";
import { getActions } from "../utils";

const OrganizationActions = getActions<IOrganization>("organization");

export default OrganizationActions;
