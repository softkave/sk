import { IOrganization } from "../../models/organization/types";
import { getSelectors } from "../utils";

const OrganizationSelectors = getSelectors<IOrganization>("organizations");

export default OrganizationSelectors;
