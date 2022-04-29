import { useSelector } from "react-redux";
import { IAppOrganization } from "../../models/organization/types";
import OrganizationSelectors from "../../redux/organizations/selectors";
import { IAppState } from "../../redux/types";
import useOrganizationIdFromPath from "./useOrganizationIdFromPath";

export default function useOrganizationFromPath(): {
  organization: IAppOrganization | undefined;
} {
  const { organizationId } = useOrganizationIdFromPath();
  const organization = useSelector<IAppState, IAppOrganization | undefined>(
    (state) => {
      if (organizationId) {
        return OrganizationSelectors.getOne(state, organizationId);
      }

      return undefined;
    }
  )!;

  return {
    organization,
  };
}
