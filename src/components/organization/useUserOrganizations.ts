import React from "react";
import { useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { appOrganizationPaths } from "../../models/app/routes";
import { IAppWorkspace, IWorkspace } from "../../models/organization/types";
import { appLoadingKeys } from "../../redux/key-value/types";
import { getUserOrganizationsOpAction } from "../../redux/operations/organization/getUserOrganizations";
import { AppDispatch, IAppState } from "../../redux/types";
import { useLoadingStateWithOp } from "../hooks/useLoadingState";

export function useUserOrganizations() {
  const history = useHistory();
  const [searchQuery, setSearchQuery] = React.useState("");
  const organizationRouteMatch = useRouteMatch<{ organizationId: string }>(
    appOrganizationPaths.organizationSelector
  );

  const selectedId = organizationRouteMatch?.params.organizationId;
  const loadKey = appLoadingKeys.userOrganizations;
  const loadOrganizations = React.useCallback(
    async (dispatch: AppDispatch) => {
      dispatch(getUserOrganizationsOpAction({ key: loadKey }));
    },
    [loadKey]
  );

  const op = useLoadingStateWithOp({ key: loadKey, initFn: loadOrganizations });
  const errorMessage = op.loadingState?.error ? "Error loading organizations" : undefined;
  const isLoading = !!op.loadingState?.isLoading;
  const organizations = useSelector<IAppState, IAppWorkspace[]>((state) => {
    return Object.values(state.organizations);
  });

  const onSelectOrganization = React.useCallback(
    (organization: IWorkspace) => {
      history.push(appOrganizationPaths.organization(organization.customId));
    },
    [history]
  );

  const activeOrganizations = React.useMemo(() => {
    if (searchQuery) {
      const searchTextLower = searchQuery.toLowerCase();
      return organizations.filter((organization) => {
        return organization.name?.toLowerCase().includes(searchTextLower);
      });
    }

    return organizations;
  }, [organizations, searchQuery]);

  return {
    errorMessage,
    isLoading,
    selectedId,
    organizations,
    activeOrganizations,
    onSelectOrganization,
    setSearchQuery,
  };
}
