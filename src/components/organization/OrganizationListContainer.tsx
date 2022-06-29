import { css } from "@emotion/css";
import React from "react";
import PageError from "../PageError";
import ListHeader from "../utilities/ListHeader";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import Scrollbar from "../utilities/Scrollbar";
import OrganizationList from "./OrganizationList";
import { useUserOrganizations } from "./useUserOrganizations";

export interface IOrganizationListContainerProps {}

const classes = {
  root: css({
    display: "flex",
    height: "100%",
    width: "100%",
    flexDirection: "column",
    padding: "8px 0px",
  }),
  header: css({ padding: "0px 16px 16px 16px !important" }),
};

const OrganizationListContainer: React.FC<IOrganizationListContainerProps> = (
  props
) => {
  const {
    activeOrganizations,
    errorMessage,
    isLoading,
    organizations,
    selectedId,
    onCreateOrganization,
    onSelectOrganization,
    setSearchQuery,
  } = useUserOrganizations();

  let listNode: React.ReactNode = null;

  if (isLoading) {
    listNode = <LoadingEllipsis />;
  } else if (errorMessage) {
    listNode = <PageError message={errorMessage}></PageError>;
  } else {
    listNode = (
      <Scrollbar>
        <OrganizationList
          organizations={activeOrganizations}
          selectedId={selectedId}
          onClickOrganization={onSelectOrganization}
        />
      </Scrollbar>
    );
  }

  return (
    <div className={classes.root}>
      <ListHeader
        disabled={isLoading}
        onSearchTextChange={setSearchQuery}
        className={classes.header}
        hideSearchButton={organizations.length === 0}
        title="Organizations"
        placeholder="Search organizations..."
        onCreate={onCreateOrganization}
      />
      {listNode}
    </div>
  );
};

export default React.memo(OrganizationListContainer);
