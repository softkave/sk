import React from "react";
import { useSelector } from "react-redux";
import { IAppOrganization } from "../../models/organization/types";
import KeyValueSelectors from "../../redux/key-value/selectors";
import { KeyValueKeys } from "../../redux/key-value/types";
import OrganizationSelectors from "../../redux/organizations/selectors";
import { IAppState } from "../../redux/types";
import MessageList from "../MessageList";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import { useLoadOrgData } from "./useLoadOrgData";
import useOrganizationIdFromPath from "./useOrganizationIdFromPath";
import { useUserOrganizations } from "./useUserOrganizations";

const useOrganizationReady = () => {
  const rootBlocksLoaded = useSelector((state) =>
    KeyValueSelectors.getKey(state as any, KeyValueKeys.RootBlocksLoaded)
  );
  const organizationsState = useUserOrganizations();
  const { organizationId } = useOrganizationIdFromPath();
  const organization = useSelector<IAppState, IAppOrganization | undefined>(
    (state) => {
      return organizationId
        ? OrganizationSelectors.getOne(state, organizationId)
        : undefined;
    }
  );
  const loadState = useLoadOrgData();
  const error =
    loadState.error || organizationsState.errorMessage
      ? new Error(organizationsState.errorMessage)
      : undefined;
  const isLoading =
    loadState.isLoading || organizationsState.isLoading || !rootBlocksLoaded;
  let stateNode: React.ReactNode = null;

  if (error) {
    stateNode = <MessageList fill messages={error} />;
  } else if (isLoading) {
    console.log({ state: loadState, organizationsState, rootBlocksLoaded });
    stateNode = <LoadingEllipsis />;
  }

  return { stateNode, isLoading, organization, error, organizationId };
};

export default useOrganizationReady;
