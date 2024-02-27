import assert from "assert";
import { SystemResourceType } from "../../../models/app/types";
import { ICollaborator } from "../../../models/collaborator/types";
import { IAppWorkspace } from "../../../models/organization/types";
import MapsSelectors from "../../../redux/maps/selectors";
import { useAppSelector } from "../redux";

export interface IUseOrganizationCollaboratorsFromReduxProps {
  organizationId: string;
}

export interface IUseOrganizationCollaboratorsFromReduxResult {
  collaborators: Array<ICollaborator>;
}

export function useOrganizationCollaboratorsFromRedux(
  props: IUseOrganizationCollaboratorsFromReduxProps
) {
  const { organizationId } = props;
  const organization = useAppSelector((state) =>
    MapsSelectors.getItem<IAppWorkspace>(state, SystemResourceType.Workspace, organizationId)
  );
  assert(organization);
  const collaborators = useAppSelector((state) =>
    MapsSelectors.getList<ICollaborator>(
      state,
      SystemResourceType.User,
      organization.collaboratorIds
    )
  );
  return { collaborators };
}
