import { useSelector } from "react-redux";
import { IAppWorkspace } from "../../models/organization/types";
import OrganizationSelectors from "../../redux/organizations/selectors";
import { IAppState } from "../../redux/types";
import useOrganizationIdFromPath from "./useOrganizationIdFromPath";

export default function useOrganizationFromPath(): {
  organization: IAppWorkspace | undefined;
} {
  const { organizationId } = useOrganizationIdFromPath();
  const organization = useSelector<IAppState, IAppWorkspace | undefined>((state) => {
    if (organizationId) {
      return OrganizationSelectors.getOne(state, organizationId);
    }

    return undefined;
  })!;

  return {
    organization,
  };
}
