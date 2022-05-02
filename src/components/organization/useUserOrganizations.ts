import React from "react";
import { useHistory, useRouteMatch } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import OperationType from "../../redux/operations/OperationType";
import { IAppState } from "../../redux/types";
import useOperation, {
  IOperationDerivedData,
  mergeOps,
} from "../hooks/useOperation";
import {
  IAppOrganization,
  IOrganization,
} from "../../models/organization/types";
import KeyValueActions from "../../redux/key-value/actions";
import {
  IUnseenChatsCountByOrg,
  KeyValueKeys,
} from "../../redux/key-value/types";
import OrganizationSelectors from "../../redux/organizations/selectors";
import { getUserOrganizationsOpAction } from "../../redux/operations/organization/getUserOrganizations";
import KeyValueSelectors from "../../redux/key-value/selectors";
import { appOrganizationPaths } from "../../models/app/routes";

export function useUserOrganizations() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [searchQuery, setSearchQuery] = React.useState("");
  const organizationRouteMatch = useRouteMatch<{ organizationId: string }>(
    appOrganizationPaths.organizationSelector
  );

  const selectedId = organizationRouteMatch?.params.organizationId;
  const unseenChatsCountMapByOrg = useSelector<
    IAppState,
    IUnseenChatsCountByOrg
  >((state) =>
    KeyValueSelectors.getKey(state, KeyValueKeys.UnseenChatsCountByOrg)
  );

  const loadOrganizations = React.useCallback(
    async (loadOrgsProps: IOperationDerivedData) => {
      const operation = loadOrgsProps.operation;
      const shouldLoad = !operation;

      if (shouldLoad) {
        await dispatch(
          getUserOrganizationsOpAction({ opId: loadOrgsProps.opId })
        );

        dispatch(
          KeyValueActions.setKey({
            key: KeyValueKeys.RootBlocksLoaded,
            value: true,
          })
        );
      }
    },
    [dispatch]
  );

  const loadOrganizationsOp = useOperation(
    { type: OperationType.GetUserOrganizations },
    loadOrganizations,
    {
      deleteManagedOperationOnUnmount: false,
      handleWaitForError: () => false,
    }
  );

  const loadOpsState = mergeOps([loadOrganizationsOp]);
  const errorMessage = loadOpsState.errors ? "Error loading data" : undefined;
  const isLoading = loadOpsState.loading;
  const organizations = useSelector<IAppState, IAppOrganization[]>((state) => {
    if (!loadOrganizationsOp.isCompleted) {
      return [];
    }

    return OrganizationSelectors.getAll(state);
  });

  const onCreateOrganization = React.useCallback(() => {
    dispatch(
      KeyValueActions.setKey({
        key: KeyValueKeys.ShowNewOrgForm,
        value: true,
      })
    );
  }, [dispatch]);

  const onSelectOrganization = React.useCallback(
    (organization: IOrganization) => {
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
    unseenChatsCountMapByOrg,
    onSelectOrganization,
    setSearchQuery,
    onCreateOrganization,
  };
}
