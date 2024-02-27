import { appMessages } from "../../models/messages";
import { IAppWorkspace } from "../../models/organization/types";
import { getSelectors } from "../utils";

const OrganizationSelectors = getSelectors<IAppWorkspace>("organizations", {
  notFoundMessage: appMessages.organizationNotFound,
});

export default OrganizationSelectors;
