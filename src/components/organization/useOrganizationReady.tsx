import React from "react";
import { useSelector } from "react-redux";
import { IAppWorkspace } from "../../models/organization/types";
import OrganizationSelectors from "../../redux/organizations/selectors";
import { IAppState } from "../../redux/types";
import MessageList from "../MessageList";
import LoadingEllipsis from "../utils/LoadingEllipsis";
import { useLoadOrganizationData } from "./useLoadOrganizationData";
import { useOrganizationIdFromPathRequired } from "./useOrganizationIdFromPath";
import { useUserOrganizations } from "./useUserOrganizations";

const useOrganizationReady = () => {
  const organizationsState = useUserOrganizations();
  const { organizationId } = useOrganizationIdFromPathRequired();
  const organization = useSelector<IAppState, IAppWorkspace | undefined>((state) => {
    return organizationId ? OrganizationSelectors.getOne(state, organizationId) : undefined;
  });

  const loadState = useLoadOrganizationData();
  const error =
    loadState?.error || organizationsState.errorMessage
      ? new Error(organizationsState.errorMessage)
      : undefined;
  const isLoading = loadState?.isLoading || organizationsState.isLoading;
  let stateNode: React.ReactNode = null;
  if (error) {
    stateNode = <MessageList maxWidth shouldFillParent messages={error} />;
  } else if (isLoading) {
    stateNode = <LoadingEllipsis />;
  }

  return { stateNode, isLoading, organization, error, organizationId };
};

export default useOrganizationReady;
