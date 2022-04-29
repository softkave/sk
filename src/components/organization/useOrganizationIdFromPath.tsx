import { useRouteMatch } from "react-router";
import { appLoggedInPaths } from "../../models/app/routes";

export default function useOrganizationIdFromPath() {
  const organizationPath = `${appLoggedInPaths.organizations}/:organizationId`;
  const selectedOrganizationRouteMatch = useRouteMatch<{
    organizationId: string;
  }>(organizationPath);

  const organizationId =
    selectedOrganizationRouteMatch &&
    selectedOrganizationRouteMatch.params.organizationId;

  return {
    organizationId,
  };
}
