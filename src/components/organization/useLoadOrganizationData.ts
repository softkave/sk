import { mergeLoadingStates } from "../../redux/operations/utils";
import { useLoadCollaborators } from "./useLoadCollaborators";
import { useOrganizationIdFromPathRequired } from "./useOrganizationIdFromPath";

export function useLoadOrganizationData() {
  const { organizationId } = useOrganizationIdFromPathRequired();
  const collaboratorsState = useLoadCollaborators(organizationId);
  return mergeLoadingStates(collaboratorsState.loadingState);
}
