import { messages } from "../../models/messages";
import { IAppOrganization } from "../../models/organization/types";
import { getSelectors } from "../utils";

const OrganizationSelectors = getSelectors<IAppOrganization>("organizations", {
  notFoundMessage: messages.organizationNotFound,
});

export default OrganizationSelectors;
